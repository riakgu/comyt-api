import { LlmService } from "./llm.service";
import { buildCommitPrompt } from "../prompts/commit.prompt";
import {
    GenerateCommitRequestSchema,
    GenerateCommitResponseSchema,
    type GenerateCommitRequest,
    type GenerateCommitResponse
} from "../schemas/commit.schema";

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