export const rulesPrompt = `
Rules:
- Always return valid JSON only.
- No markdown, no explanations.
- Do not hallucinate files not present in the diff.
- Respect options exactly.
- Follow Conventional Commits when format="conventional".

Heuristics:
- deps only → chore(deps)
- docs only → docs
- tests only → test
- formatting only → style
- refactor only → refactor
`;
