export const examplesPrompt = `
Example input diff:
diff --git a/README.md b/README.md
+ update documentation

Correct output:
{
  "mode": "single",
  "commit": {
    "message": "docs: update documentation",
    "type": "docs",
    "scope": null,
    "confidence": 0.90
  }
}
`;
