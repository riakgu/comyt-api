import { systemPrompt } from "./system";
import { rulesPrompt } from "./rules";
import { outputSchemaPrompt } from "./schema";
import { examplesPrompt } from "./examples";

export function buildCommitPrompt(diff: string, options: any) {
    const system = [
        systemPrompt.trim(),
        rulesPrompt.trim()
    ].join("\n\n");

    const user = `
Analyze the following git diff and generate commit output.

DIFF:
${diff}

OPTIONS:
${JSON.stringify(options, null, 2)}

${outputSchemaPrompt}

${examplesPrompt}
  `.trim();

    return { system, user };
}
