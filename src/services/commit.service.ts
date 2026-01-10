import { LlmService } from "./llm.service";
import { CommitPrompt } from "../prompts/commit.prompt";
import type { GenerateCommitRequest, GenerateCommitResponse } from "../models/commit.model";
import { Validation } from "../validations";
import { CommitValidation } from "../validations/commit.validation";

export class CommitService {

    static async generate(request: GenerateCommitRequest): Promise<GenerateCommitResponse> {
        const generateRequest = Validation.validate(CommitValidation.GENERATE, request);

        const message = await LlmService.chat([
            { role: "system", content: CommitPrompt.system },
            { role: "user", content: CommitPrompt.user(generateRequest.diff) },
        ]);

        return { message };
    }

}