---
name: github-cli
description: Comprehensive management of GitHub entities via the `gh` command-line tool. Use this skill when the user needs to interact with GitHub for tasks like managing PRs, issues, repository operations, or monitoring GitHub Actions.
---

# GitHub CLI (`gh`)

This skill provides specialized workflows and commands for interacting with GitHub using the official GitHub CLI (`gh`).

## Quick Start

Before using this skill, ensure the GitHub CLI is installed and authenticated.

- **Check Auth Status**: `gh auth status`
- **Login**: `gh auth login`
- **Setup Git**: `gh auth setup-git`

## Core Workflows

### 1. Pull Request Management
Use these commands for the end-to-end PR lifecycle.

- **Create PR**: `gh pr create --title "Title" --body "Description" --draft`
- **List PRs**: `gh pr list --state open --author "@me"`
- **View PR**: `gh pr view <number> --web` (opens in browser) or `gh pr view <number>` (in terminal)
- **Checkout PR**: `gh pr checkout <number>` (checks out the branch locally)
- **Review PR**: `gh pr review <number> --approve --body "LGTM!"`
- **Merge PR**: `gh pr merge <number> --squash --delete-branch`
- **Check CI Status**: `gh pr checks <number> --watch`

### 2. Issue Management
Track and manage tasks directly from the terminal.

- **List Issues**: `gh issue list --label "bug" --assignee "@me"`
- **Create Issue**: `gh issue create --title "Bug: Title" --body "Description" --label "bug"`
- **View Issue**: `gh issue view <number>`
- **Comment**: `gh issue comment <number> --body "Adding more context..."`
- **Status**: `gh issue status` (shows issues relevant to you)

### 3. Repository Operations
Manage your code repositories efficiently.

- **Clone Repo**: `gh repo clone <owner>/<repo>`
- **Create Repo**: `gh repo create <name> --public --source=. --remote=upstream`
- **Fork Repo**: `gh repo fork <owner>/<repo> --clone`
- **Sync Fork**: `gh repo sync` (syncs with upstream)
- **Browse Files**: `gh browse` (opens the current repo in browser)

### 4. GitHub Actions (Workflows)
Monitor and trigger CI/CD pipelines.

- **List Runs**: `gh run list --workflow <filename>`
- **View Run Logs**: `gh run view <run-id> --log`
- **Watch Run**: `gh run watch <run-id>` (waits for completion)
- **Trigger Workflow**: `gh workflow run <filename> -f param=value`

## Advanced Usage

### Aliases
Create custom shortcuts for complex commands:
`gh alias set pr-mine "pr list --author @me"`

### Searching
Search across all of GitHub:
`gh search repos "task manager" --language "C#"`

## References

For a comprehensive list of all commands and flags, see [references/commands.md](references/commands.md).

## Scripts

This skill includes specialized scripts for common multi-step tasks:

- **Sync and Push Fork**: [scripts/sync-fork.sh](scripts/sync-fork.sh)
  Automatically syncs your local fork with upstream and pushes the changes to your origin.
