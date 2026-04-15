# GitHub CLI (`gh`) Detailed Command Reference

This document provides a more extensive list of `gh` commands and their common flags.

## Authentication (`gh auth`)

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh auth login` | Authenticate with GitHub | `--with-token`, `--hostname`, `--scopes` |
| `gh auth logout` | Log out of a GitHub host | `--hostname` |
| `gh auth status` | Check authentication status | `--hostname`, `--show-token` |
| `gh auth setup-git` | Configure git to use `gh` for credentials | `--hostname` |
| `gh auth refresh` | Refresh stored credentials | `--scopes` |

## Pull Requests (`gh pr`)

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh pr create` | Create a pull request | `--draft`, `--fill`, `--label`, `--reviewer`, `--assignee`, `--base`, `--head` |
| `gh pr list` | List pull requests | `--state (open, closed, all)`, `--author`, `--assignee`, `--label`, `--search`, `--limit` |
| `gh pr checkout` | Check out a PR locally | `--recurse-submodules` |
| `gh pr view` | View PR details | `--web`, `--comments`, `--json` |
| `gh pr diff` | View changes in a PR | `--color`, `--patch` |
| `gh pr checks` | Show status of CI checks | `--watch`, `--interval` |
| `gh pr review` | Add a review to a PR | `--approve`, `--request-changes`, `--comment`, `--body` |
| `gh pr merge` | Merge a PR | `--merge`, `--squash`, `--rebase`, `--delete-branch`, `--admin` |
| `gh pr close` | Close a PR | `--delete-branch` |
| `gh pr reopen` | Reopen a PR | |
| `gh pr edit` | Edit a PR | `--title`, `--body`, `--add-label`, `--remove-label` |

## Issues (`gh issue`)

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh issue create` | Create a new issue | `--title`, `--body`, `--label`, `--assignee`, `--milestone` |
| `gh issue list` | List issues | `--state (open, closed, all)`, `--author`, `--assignee`, `--label`, `--search`, `--limit` |
| `gh issue view` | View issue details | `--web`, `--comments`, `--json` |
| `gh issue status` | Show relevant issues | |
| `gh issue comment` | Add a comment | `--body`, `--editor` |
| `gh issue close` | Close an issue | |
| `gh issue reopen` | Reopen an issue | |
| `gh issue edit` | Edit an issue | `--title`, `--body`, `--add-label`, `--remove-label` |

## Repositories (`gh repo`)

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh repo create` | Create a new repository | `--public`, `--private`, `--source`, `--remote`, `--template` |
| `gh repo clone` | Clone a repository | |
| `gh repo fork` | Fork a repository | `--clone`, `--remote`, `--org` |
| `gh repo sync` | Sync a fork | `--branch`, `--force` |
| `gh repo view` | View repository details | `--web`, `--branch` |
| `gh repo list` | List repositories | `--user`, `--org`, `--language`, `--public`, `--private` |
| `gh repo archive` | Archive a repository | `--confirm` |
| `gh repo delete` | Delete a repository | `--confirm` |

## GitHub Actions (`gh run`, `gh workflow`)

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh run list` | List recent workflow runs | `--workflow`, `--status`, `--branch`, `--user`, `--limit` |
| `gh run view` | View run details | `--log`, `--verbose`, `--web`, `--exit-status` |
| `gh run watch` | Watch a running workflow | `--interval`, `--exit-status` |
| `gh run rerun` | Rerun a failed run | `--failed` |
| `gh run cancel` | Cancel a running run | |
| `gh workflow list` | List workflows | `--all` |
| `gh workflow view` | View workflow details | `--web`, `--yaml` |
| `gh workflow run` | Manually trigger a workflow | `--field`, `--raw-field`, `--ref` |
| `gh workflow enable` | Enable a workflow | |
| `gh workflow disable` | Disable a workflow | |

## Utilities & Misc

| Command | Description | Common Flags |
| --- | --- | --- |
| `gh browse` | Open current repo in browser | `--branch`, `--settings`, `--wiki` |
| `gh alias set` | Create custom shortcut | |
| `gh alias list` | List all aliases | |
| `gh alias delete` | Delete an alias | |
| `gh search repos` | Search repositories | `--owner`, `--language`, `--stars`, `--topic` |
| `gh search prs` | Search pull requests | `--author`, `--state`, `--label`, `--review` |
| `gh search issues` | Search issues | `--author`, `--state`, `--label`, `--assignee` |
| `gh secret set` | Create or update a secret | `--body`, `--env`, `--org` |
| `gh secret list` | List secrets | `--env`, `--org` |
| `gh variable set` | Create or update a variable | `--body`, `--env`, `--org` |
| `gh variable list` | List variables | `--env`, `--org` |
| `gh config get` | Get a configuration value | |
| `gh config set` | Set a configuration value | |
| `gh version` | Show `gh` version | |
| `gh help` | Show help for a command | |
