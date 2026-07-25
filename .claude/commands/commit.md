---
description: Stage and commit the current changes with a well-crafted message
---

Commit the current changes.

1. Run `git status`, `git diff` (staged and unstaged), and `git log --oneline -5` in parallel to see what changed and match this repo's commit style.
2. Stage the relevant files by name (never `git add -A` or `git add .`). Skip anything that looks like a secret or credential and warn me if so.
3. Write a concise 1-2 sentence commit message focused on *why* the change was made, matching the tone of recent commits in this repo.
4. Create the commit ending with:
   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
5. Run `git status` after to confirm success.

Do not push. Do not amend existing commits. If there is nothing staged or changed, tell me instead of creating an empty commit.

$ARGUMENTS
