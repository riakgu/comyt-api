export const outputSchemaPrompt = `
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
`;
