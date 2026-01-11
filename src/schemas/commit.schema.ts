import { z } from "zod";

export const CommitOptionsSchema = z.object({
    format: z.enum(["conventional", "free"]).optional(),
    language: z.enum(["id", "en"]).optional(),
    commit_strategy: z.enum(["single", "split"]).optional(),
    split_strategy: z.enum(["auto", "by_file", "by_type"]).optional(),
    generate_git_command: z.boolean().optional(),
});

export type CommitOptions = z.infer<typeof CommitOptionsSchema>;

export const CommitContextSchema = z
    .object({
        status: z
            .string()
            .min(1)
            .refine(
                (val) => {
                    const lines = val.split("\n").map((l) => l.trimEnd());
                    const statusLineRegex = /^[ MADRCU?!]{1,2}\s+.+$/;
                    return lines.every((line) => statusLineRegex.test(line));
                },
                {
                    message:
                        "Invalid git status format. Expected output similar to `git status --short`.",
                }
            )
            .optional(),

        log: z
            .string()
            .min(1)
            .refine(
                (val) => {
                    const lines = val.split("\n").map((l) => l.trim());
                    const logLineRegex = /^[a-f0-9]{6,40}\s.+$/i;
                    return lines.every((line) => logLineRegex.test(line));
                },
                {
                    message:
                        "Invalid git log format. Expected output similar to `git log --oneline`.",
                }
            )
            .optional(),
    })
    .optional();

export type CommitContext = z.infer<typeof CommitContextSchema>;

export const GenerateCommitRequestSchema = z.object({
    diff: z
        .string()
        .min(1, "Diff is required")
        .refine(
            (diff) => {
                const diffPatterns = [
                    /^diff --git/m,
                    /^@@.*@@/m,
                    /^[\+\-]/m,
                    /^index [a-f0-9]+/m,
                ];
                return diffPatterns.some((pattern) => pattern.test(diff));
            },
            {
                message: "Invalid git diff format. The input must be a valid git diff output.",
            }
        ),

    context: CommitContextSchema,

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
