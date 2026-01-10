import { LlmService } from "./llm.service";
import type { GenerateCommitRequest, GenerateCommitResponse } from "../models/commit.model";
import { buildCommitPrompt } from "../prompts/commit/builder";
import { GenerateCommitRequestSchema, GenerateCommitResponseSchema } from "../schemas/commit.schema";

export class CommitService {

    static async generate(request: GenerateCommitRequest): Promise<GenerateCommitResponse> {
        const { diff, options } = GenerateCommitRequestSchema.parse(request);

        const { system, user } = buildCommitPrompt(diff, options);

        const result = await LlmService.chatJson([
            { role: "system", content: system },
            { role: "user", content: user },
        ]);

        const validated = GenerateCommitResponseSchema.parse(result);

        return validated;
    }

}