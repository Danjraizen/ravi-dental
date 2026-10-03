# Reusable Prompt: Create Portable Codex Project Context

```text
Create a durable, account-independent project context pack for this repository so future Codex chats, machines, and accounts can continue the work without relying on prior chat history.

First inspect the repository, existing documentation, Git status/history, package scripts, deployment configuration, and any project instructions. Do not expose secrets or modify production services.

Then create or improve these files, preserving useful existing instructions:
1. AGENTS.md — project purpose, safe working rules, validation commands, and rules for updating context.
2. docs/PROJECT-HANDOFF.md — architecture, environments/deployment references without secrets, completed work, current priorities, verification status, and next steps.
3. docs/PROJECT-OPERATIONS.md only when setup, testing, deployment, or rollback requires a durable runbook.
4. docs/DECISIONS.md only when significant decisions are not already documented.

Use repository evidence, label uncertainty as “Needs confirmation,” and do not invent facts. Keep the files concise and linked from AGENTS.md. Do not change application code unless required to add the documentation. Report files changed, uncertainties, and validation performed.
```
