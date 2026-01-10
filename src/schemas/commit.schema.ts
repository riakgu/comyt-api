import { z } from "zod";

export const CommitOptionsSchema = z.object({
    format: z.enum(["conventional", "free"]).optional(),
    language: z.enum(["id", "en"]).optional(),
    commit_strategy: z.enum(["single", "split"]).optional(),
    split_strategy: z.enum(["auto", "by_file", "by_type"]).optional(),
    generate_git_command: z.boolean().optional(),
});

export const GenerateCommitRequestSchema = z.object({
    diff: z.string().min(1, "Diff is required"),
    options: CommitOptionsSchema.optional(),
});

export type GenerateCommitRequest = z.infer<
    typeof GenerateCommitRequestSchema
>;

export const CommitInfoSchema = z.object({
    message: z.string().min(1),
    type: z.string().min(1),
    scope: z.string().nullable(),
    confidence: z.number().min(0).max(1),
});

export const SingleCommitResponseSchema = z.object({
    mode: z.literal("single"),
    commit: CommitInfoSchema,
    git_commands: z.array(z.string()).optional(),
});

export const SplitCommitResponseSchema = z.object({
    mode: z.literal("split"),
    commits: z
        .array(
            z.object({
                files: z.array(z.string().min(1)),
                commit: CommitInfoSchema,
                git_commands: z.array(z.string()).optional(),
            })
        )
        .min(1),
});

export const GenerateCommitResponseSchema = z.union([
    SingleCommitResponseSchema,
    SplitCommitResponseSchema,
]);

export type GenerateCommitResponse = z.infer<
    typeof GenerateCommitResponseSchema
>;
