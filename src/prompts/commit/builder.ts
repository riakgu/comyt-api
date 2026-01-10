import { systemPrompt } from "./system";
import { rulesPrompt } from "./rules";
import { outputSchemaPrompt } from "./schema";
import { examplesPrompt } from "./examples";
import type { CommitOptions } from "../../schemas/commit.schema";

export function buildCommitPrompt(diff: string, options?: CommitOptions) {
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
