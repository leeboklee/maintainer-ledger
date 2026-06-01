# Maintainer Ledger

Evidence-first triage and release workflow for open-source maintainers.

Maintainer Ledger is a small CLI for open-source maintainers who need a fast first pass on GitHub issues and pull requests.

It turns a GitHub issue or PR URL into:

- a short maintainer summary
- recommended labels
- a risk level
- a next action
- a reply draft
- a release note draft

The tool does not merge code or make decisions for you. It prepares a review packet with the evidence a maintainer needs before labeling, replying, merging, or writing release notes.

## Why this exists

Open-source maintainers repeatedly do the same work: read an issue, infer the scope, choose labels, ask for missing information, review pull request risk, and later write release notes.

Maintainer Ledger makes that workflow explicit and reusable. It is designed for maintainers who want Codex-assisted workflows without handing final judgment to automation.

## Open-source maintainer workflow

Maintainer Ledger focuses on the work that quietly consumes maintainer time:

- issue triage and missing-information replies
- pull request risk review before human review
- release note drafting from accepted changes
- repeatable decision records for similar future issues

This makes it a practical fit for public repositories that receive small issues, drive-by pull requests, or repeated feature requests.

## Quick start

```bash
npm install -g maintainer-ledger
maintainer-ledger https://github.com/owner/repo/issues/123
maintainer-ledger https://github.com/owner/repo/pull/456
```

For private repositories or higher GitHub API limits:

```bash
GITHUB_TOKEN=ghp_your_token maintainer-ledger https://github.com/owner/repo/issues/123
```

## Local demo

```bash
npm run demo
npm run check
```

Example output:

```text
Source: #42 issue
Summary: Add Korean electricity bill calculator: Users want a calculator for tiered electricity pricing.
Risk: medium (3)
Labels: enhancement, feature, calculator
Next action: Confirm scope, label the issue, and invite a focused pull request.
Reply draft: Thanks for the issue. This looks in scope; I marked it for enhancement, feature, calculator review.
Release note: - Changed: Add Korean electricity bill calculator
```

## Use cases

- First-pass issue triage
- Pull request review preparation
- Duplicate and risk review notes
- Release note drafting
- Consistent maintainer replies

## Example maintainer scenario

A public project receives an issue asking for a Korean electricity bill calculator. The maintainer runs:

```bash
maintainer-ledger https://github.com/owner/repo/issues/123
```

Maintainer Ledger returns the scope, likely labels, missing questions, risk level, and a reply draft. The maintainer can then decide whether to accept the feature request, ask for rate-source details, or split the work into a good first issue.

For a pull request, the same command creates a compact review packet and release note draft before the maintainer opens the full diff.

## Roadmap

- GitHub Action mode for pull request comments
- Decision history file for repeated maintainer judgment
- Configurable label rules
- Optional AI provider adapters

## Codex for OSS fit

Maintainer Ledger is built around the workflows highlighted by open-source maintainers: issue triage, pull request review, release preparation, and maintenance automation. API credits can be used to add optional Codex summaries, duplicate detection, and repository-specific decision memory while preserving maintainer control.

## License

MIT
