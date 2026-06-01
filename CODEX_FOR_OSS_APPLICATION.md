# Codex for OSS application draft

## Project title

Maintainer Ledger: evidence-first triage and release workflow for open-source maintainers

## Repository description

Maintainer Ledger is a public CLI for open-source maintainers. It turns GitHub issue and pull request URLs into review packets: summary, recommended labels, risk level, next action, reply draft, and release note draft.

## Why this project fits

Open-source maintainers repeatedly spend time reading issues, sorting labels, asking for missing information, reviewing pull request risk, and writing release notes. Maintainer Ledger reduces that repetitive overhead while keeping the maintainer in control of the final decision. It is useful for small and mid-sized public projects that need lightweight maintainer automation without a hosted service.

## Role

Primary maintainer.

## API credit plan

API credits would be used to add optional Codex-powered summaries, duplicate issue detection, risk explanations, and repository-specific decision memory for issue triage, pull request review, and release workflows. The base CLI remains usable without an API key, while Codex improves maintainer automation for public repositories.

## Six-month goal

Ship a GitHub Action, configurable label rules, decision-history storage, and documented examples for three real public repositories.
