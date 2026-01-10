export type GenerateCommitRequest = {
    diff: string;
    options?: CommitOptions;
};

export type CommitOptions = {
    format?: "conventional" | "free";
    language?: "id" | "en";
    commit_strategy?: "single" | "split";
    split_strategy?: "auto" | "by_file" | "by_type";
    generate_git_command?: boolean;
};

export type CommitInfo = {
    message: string;
    type: string;
    scope: string | null;
    confidence: number;
};

export type SingleCommitResponse = {
    mode: "single";
    commit: CommitInfo;
    git_commands?: string[] | undefined;
};

export type SplitCommitResponse = {
    mode: "split";
    commits: {
        files: string[];
        commit: CommitInfo;
        git_commands?: string[] | undefined;
    }[];
};

export type GenerateCommitResponse =
    | SingleCommitResponse
    | SplitCommitResponse;
