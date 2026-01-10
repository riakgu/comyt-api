import { z, ZodType } from "zod";
import { GenerateCommitRequest } from "../models/commit.model";

export class CommitValidation {

    static readonly GENERATE: ZodType<GenerateCommitRequest> = z.object({
        diff: z.string().min(1, "Diff is required"),
    })

}