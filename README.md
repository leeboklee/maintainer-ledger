# Maintainer Ledger

Evidence-first triage and release workflow for open-source maintainers.

## 한국어 설명

Maintainer Ledger는 오픈소스 관리자가 GitHub 이슈와 Pull Request를 빠르게 판단하도록 도와주는 작은 터미널 도구입니다.

GitHub 이슈나 PR 주소를 넣으면 아래 내용을 한 번에 정리합니다.

- 어떤 요청인지 짧은 요약
- 붙이면 좋은 라벨
- 위험도
- 다음에 할 일
- 답변 초안
- 릴리스 노트 초안

예를 들어 누가 "README에 Node 20 설치 방법을 더 명확히 적어 주세요"라는 이슈를 올리면, 이 도구는 요청 내용을 요약하고 `docs`, `compatibility` 같은 라벨을 추천하며, 관리자가 남길 답변 초안까지 만들어 줍니다.

이 도구는 사람 대신 결정을 내리는 프로그램이 아닙니다. 관리자가 매번 반복해서 읽고 정리하는 시간을 줄여 주는 보조 도구입니다.

Codex for OSS 신청용으로는 "오픈소스 메인테이너의 이슈 분류, PR 검토, 릴리스 준비 시간을 줄이는 프로젝트"라는 명분으로 설명할 수 있습니다.

## English

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
Summary: Clarify Node 20 installation steps in the README: Contributors are unsure which Node.js version is required.
Risk: low (1)
Labels: documentation, docs, compatibility
Next action: Confirm scope, label the issue, and invite a focused pull request.
Reply draft: Thanks for the issue. This looks in scope; I marked it for documentation, docs, compatibility review.
Release note: - Documentation: Clarify Node 20 installation steps in the README
```

## Use cases

- First-pass issue triage
- Pull request review preparation
- Duplicate and risk review notes
- Release note drafting
- Consistent maintainer replies

## Example maintainer scenario

A public project receives an issue asking for clearer Node 20 installation instructions. The maintainer runs:

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
