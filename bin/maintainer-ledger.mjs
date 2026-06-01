#!/usr/bin/env node

import fs from "node:fs/promises";
import process from "node:process";

const demoPayload = {
  html_url: "https://github.com/example/project/issues/42",
  number: 42,
  title: "Clarify Node 20 installation steps in the README",
  body: "Contributors are unsure which Node.js version is required. The README should mention Node 20, npm install, and how to run the local demo command.",
  labels: [{ name: "documentation" }],
  user: { login: "sample-contributor" },
  state: "open",
  pull_request: undefined,
};

const labelRules = [
  { label: "bug", words: ["bug", "broken", "crash", "error", "fail", "wrong", "regression"] },
  { label: "security", words: ["security", "xss", "csrf", "token", "secret", "vulnerability"] },
  { label: "docs", words: ["readme", "docs", "documentation", "typo", "guide"] },
  { label: "release", words: ["release", "changelog", "migration"] },
  { label: "feature", words: ["feature", "add", "support", "enhancement"] },
  { label: "needs-info", words: ["unclear", "question", "cannot-reproduce"] },
  { label: "compatibility", words: ["node", "version", "runtime", "install", "setup"] },
  { label: "maintenance", words: ["refactor", "cleanup", "dependency", "ci", "test"] },
];

function parseArgs(argv) {
  const args = { format: "text" };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === "--demo") args.demo = true;
    else if (item === "--json") args.format = "json";
    else if (item === "--file") args.file = argv[++i];
    else if (item === "--help" || item === "-h") args.help = true;
    else if (!args.url) args.url = item;
  }
  return args;
}

function help() {
  return `maintainer-ledger

Usage:
  maintainer-ledger <github-issue-or-pr-url>
  maintainer-ledger --file ./examples/issue.json
  maintainer-ledger --demo

Options:
  --json        Print machine-readable JSON
  --file PATH   Read a GitHub issue or PR API payload from a local file
  --demo        Run with bundled sample data
`;
}

function parseGitHubUrl(input) {
  const url = new URL(input);
  const parts = url.pathname.split("/").filter(Boolean);
  const [owner, repo, kind, number] = parts;
  if (url.hostname !== "github.com" || !owner || !repo || !["issues", "pull"].includes(kind) || !number) {
    throw new Error("Expected a GitHub issue or pull request URL.");
  }
  return { owner, repo, kind, number };
}

async function fetchGitHubPayload(inputUrl) {
  const { owner, repo, number } = parseGitHubUrl(inputUrl);
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "maintainer-ledger",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function normalizePayload(payload) {
  const body = payload.body || "";
  const title = payload.title || "Untitled";
  const existingLabels = Array.isArray(payload.labels) ? payload.labels.map((label) => label.name || label) : [];
  const type = payload.pull_request ? "pull_request" : "issue";
  return {
    type,
    number: payload.number,
    url: payload.html_url,
    author: payload.user?.login || "unknown",
    state: payload.state || "unknown",
    title,
    body,
    existingLabels,
    text: `${title}\n${body}`.toLowerCase(),
    tokens: new Set(`${title}\n${body}`.toLowerCase().match(/[a-z0-9-]+/g) || []),
  };
}

function summarize(item) {
  const cleanBody = item.body.replace(/\s+/g, " ").trim();
  const firstSentence = cleanBody.split(/(?<=[.!?])\s+/)[0] || cleanBody;
  const summary = firstSentence ? `${item.title}: ${firstSentence}` : item.title;
  return truncate(summary, 180);
}

function recommendLabels(item) {
  const labels = new Set(item.existingLabels);
  for (const rule of labelRules) {
    if (rule.words.some((word) => item.tokens.has(word))) {
      labels.add(rule.label);
    }
  }
  if (item.body.length < 120 && !labels.has("docs")) labels.add("needs-info");
  return [...labels].slice(0, 6);
}

function scoreRisk(item, labels) {
  let score = 1;
  const text = item.text;
  if (item.type === "pull_request") score += 1;
  if (labels.includes("security")) score += 3;
  if (labels.includes("bug")) score += 1;
  if (text.includes("breaking") || text.includes("migration")) score += 2;
  if (text.includes("auth") || text.includes("payment") || text.includes("secret")) score += 2;
  if (item.body.length > 1200) score += 1;
  if (score >= 6) return { level: "high", score };
  if (score >= 3) return { level: "medium", score };
  return { level: "low", score };
}

function nextAction(item, labels, risk) {
  if (labels.includes("needs-info")) return "Ask for reproduction steps, expected behavior, and environment details before assigning work.";
  if (risk.level === "high") return "Require maintainer review, tests, and a security-focused check before merge or public guidance.";
  if (item.type === "pull_request") return "Review the diff, confirm tests, and decide whether this should be included in the next release.";
  return "Confirm scope, label the issue, and invite a focused pull request.";
}

function draftReply(item, labels, risk) {
  if (labels.includes("needs-info")) {
    return "Thanks for opening this. Could you add the expected behavior, actual behavior, and a minimal reproduction so we can triage it correctly?";
  }
  if (risk.level === "high") {
    return "Thanks for the report. This touches a higher-risk area, so a maintainer will review the scope and required tests before we move it forward.";
  }
  return `Thanks for the ${item.type === "pull_request" ? "pull request" : "issue"}. This looks in scope; I marked it for ${labels.slice(0, 3).join(", ")} review.`;
}

function releaseNote(item, labels) {
  const category = labels.includes("bug") ? "Fixed" : labels.includes("docs") ? "Documentation" : "Changed";
  return `- ${category}: ${item.title}`;
}

function analyze(payload) {
  const item = normalizePayload(payload);
  const labels = recommendLabels(item);
  const risk = scoreRisk(item, labels);
  return {
    source: {
      type: item.type,
      number: item.number,
      url: item.url,
      author: item.author,
      state: item.state,
    },
    summary: summarize(item),
    recommendedLabels: labels,
    risk,
    nextAction: nextAction(item, labels, risk),
    replyDraft: draftReply(item, labels, risk),
    releaseNoteDraft: releaseNote(item, labels),
  };
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function renderText(result) {
  return [
    `Source: #${result.source.number || "demo"} ${result.source.type}`,
    `Summary: ${result.summary}`,
    `Risk: ${result.risk.level} (${result.risk.score})`,
    `Labels: ${result.recommendedLabels.join(", ")}`,
    `Next action: ${result.nextAction}`,
    `Reply draft: ${result.replyDraft}`,
    `Release note: ${result.releaseNoteDraft}`,
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.demo && !args.file && !args.url)) {
    console.log(help());
    return;
  }

  let payload;
  if (args.demo) {
    payload = demoPayload;
  } else if (args.file) {
    payload = JSON.parse(await fs.readFile(args.file, "utf8"));
  } else {
    payload = await fetchGitHubPayload(args.url);
  }

  const result = analyze(payload);
  if (args.format === "json") {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(renderText(result));
  }
}

main().catch((error) => {
  console.error(`maintainer-ledger: ${error.message}`);
  process.exitCode = 1;
});
