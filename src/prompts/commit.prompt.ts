import type { CommitOptions, CommitContext } from "../schemas/commit.schema";

export function buildCommitPrompt(
  diff: string,
  context?: CommitContext,
  options?: CommitOptions,
) {
  const system = `
You are an expert software engineer and Git workflow assistant.

Rules:
- Always return valid JSON only.
- No markdown, no explanations.
- Do not hallucinate files not present in the diff.
- Respect options exactly.
- Follow Conventional Commits when format="conventional".
- When generate_git_command=true, NEVER use "git add .".
- Always explicitly list files in git add commands (e.g. "git add src/file.ts README.md").
- If additional context is provided, use it to improve commit quality, grouping, and wording.

Heuristics:
- deps only → chore(deps)
- docs only → docs
- tests only → test
- formatting only → style
- refactor without behavior change → refactor
- update package-lock.json only → chore(deps)

If commit_strategy="single":
- Produce exactly one commit.

If commit_strategy="split":
- Split changes into logical commits.
- Do not create too many commits unless changes are clearly unrelated.
- Each commit must contain only related files.
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

OPTIONS:
${JSON.stringify(options, null, 2)}

Output format:

If commit_strategy="single":
{
  "mode": "single",
  "commit": {
    "message": string,
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
