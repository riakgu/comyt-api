import type { CommitOptions, CommitContext } from "../schemas/commit.schema";

export function buildCommitPrompt(
  diff: string,
  context?: CommitContext,
  options?: CommitOptions,
) {
  const system = `
You are an expert software engineer and Git workflow assistant.

Core rules:
- Always return valid JSON only.
- Do not output markdown or explanations.
- Do not hallucinate files, behavior, or details not present in the diff or context.
- Respect the provided options exactly.
- Follow Conventional Commits when format="conventional".

Git command behavior:
- Prefer explicit file paths in git commands (e.g. "git add src/file.ts").
- Generated git commands must only include files that belong to the commit.
- When a commit body is generated and generate_git_command=true, include the body in the git commit command using an additional -m flag.

Use of context:
- If additional context is provided, use it to improve accuracy and clarity.
- Do not assume technologies, frameworks, or behavior unless they appear in the diff or context.

Commit body behavior (when include_body=true):
- The body must only describe what is directly observable from the diff or context.
- Do not introduce technical details that are not explicitly shown.
- Prefer paraphrasing the diff rather than interpreting implementation.
- If the change is ambiguous, keep the body short and high-level.
- Prefer under-describing over over-describing.

Heuristics:
- deps only → chore(deps)
- docs only → docs
- tests only → test
- formatting only → style
- refactor without behavior change → refactor
- update package-lock.json only → chore(deps)

Commit strategy:
- If commit_strategy="single": produce exactly one commit.
- If commit_strategy="split":
  - Split changes into logical commits.
  - Avoid creating too many commits unless changes are clearly unrelated.
  - Each commit must only contain related files.
`.trim();

  const examples = `
Example 1:

DIFF:
diff --git a/README.md b/README.md
+ update installation instructions

OPTIONS:
{ "commit_strategy": "single", "format": "conventional", "generate_git_command": true }

OUTPUT:
{
  "mode": "single",
  "commit": {
    "message": "docs: update installation instructions",
    "type": "docs",
    "scope": null,
    "confidence": 0.91
  },
  "git_commands": [
    "git add README.md",
    "git commit -m \\"docs: update installation instructions\\""
  ]
}

Example 2:

DIFF:
diff --git a/src/auth/login.ts b/src/auth/login.ts
+ add token validation

diff --git a/README.md b/README.md
+ update auth documentation

OPTIONS:
{ "commit_strategy": "split", "format": "conventional", "generate_git_command": true }

OUTPUT:
{
  "mode": "split",
  "commits": [
    {
      "files": ["src/auth/login.ts"],
      "commit": {
        "message": "feat(auth): add token validation",
        "type": "feat",
        "scope": "auth",
        "confidence": 0.93
      },
      "git_commands": [
        "git add src/auth/login.ts",
        "git commit -m \\"feat(auth): add token validation\\""
      ]
    },
    {
      "files": ["README.md"],
      "commit": {
        "message": "docs: update auth documentation",
        "type": "docs",
        "scope": null,
        "confidence": 0.90
      },
      "git_commands": [
        "git add README.md",
        "git commit -m \\"docs: update auth documentation\\""
      ]
    }
  ]
}

Example 3:

DIFF:
diff --git a/src/auth/login.ts b/src/auth/login.ts
+ handle expired token

OPTIONS:
{ "commit_strategy": "single", "format": "conventional", "include_body": true }

OUTPUT:
{
  "mode": "single",
  "commit": {
    "message": "fix(auth): handle expired token",
    "body": "Add handling for expired token.",
    "type": "fix",
    "scope": "auth",
    "confidence": 0.88
  }
}

`.trim();

  const user = `
${examples}

Now analyze the following git changes and generate commit output.

DIFF:
${diff}

GIT STATUS --SHORT(if provided):
${context?.status ?? "N/A"}

GIT LOG --ONELINE (if provided):
${context?.log ?? "N/A"}

ADDITIONAL NOTES (if provided):
${context?.notes ?? "N/A"}

OPTIONS:
${JSON.stringify(options, null, 2)}

Output format:

If commit_strategy="single":
{
  "mode": "single",
  "commit": {
    "message": string,
    "body": string (only if include_body=true),
    "type": string,
    "scope": string | null,
    "confidence": number
  },
  "git_commands": string[] (if generate_git_command=true)
}

If commit_strategy="split":
{
  "mode": "split",
  "commits": [
    {
      "files": string[],
      "commit": {
        "message": string,
        "body": string (only if include_body=true),
        "type": string,
        "scope": string | null,
        "confidence": number
      },
      "git_commands": string[] (if generate_git_command=true)
    }
  ]
}

Important:
- Output JSON only
- No extra text
- git_commands must never contain "git add ."
- Always list files explicitly in git add
`.trim();

  return { system, user };
}
