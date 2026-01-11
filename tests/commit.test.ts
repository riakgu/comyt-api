import supertest from "supertest";
import { app } from "../src/config/express";

describe('POST /api/commits/generate', () => {

    it('should be able to generate single commit message', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/src/index.ts b/src/index.ts
index 1234567..abcdefg 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,3 +1,5 @@
+import { logger } from './logger';
+
 export function main() {
-    console.log('Hello');
+    logger.info('Hello');
 }`,
                options: {
                    format: "conventional",
                    language: "en",
                    commit_strategy: "single"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.mode).toBe("single");
        expect(response.body.data.commit).toBeDefined();
        expect(response.body.data.commit.message).toBeDefined();
        expect(response.body.data.commit.type).toBeDefined();
        expect(typeof response.body.data.commit.confidence).toBe('number');
    }, 30000);

    it('should be able to generate split commits', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Updated documentation

diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1,2 @@
 console.log('hello');
+console.log('world');`,
                options: {
                    format: "conventional",
                    commit_strategy: "split",
                    split_strategy: "by_file"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.mode).toBe("split");
        expect(response.body.data.commits).toBeDefined();
        expect(Array.isArray(response.body.data.commits)).toBe(true);
    }, 30000);

    it('should generate git commands when requested', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Added description`,
                options: {
                    format: "conventional",
                    commit_strategy: "single",
                    generate_git_command: true
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.git_commands).toBeDefined();
        expect(Array.isArray(response.body.data.git_commands)).toBe(true);
    }, 30000);

    it('should reject if diff is empty', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: ""
            });

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.diff).toBeDefined();
        expect(Array.isArray(response.body.errors.diff)).toBe(true);
    });

    it('should reject if diff is missing', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({});

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.diff).toBeDefined();
        expect(Array.isArray(response.body.errors.diff)).toBe(true);
    });

    it('should reject invalid diff format', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: "this is not a valid git diff"
            });

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.diff).toBeDefined();
    });

    it('should accept valid git status context', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Added description`,
                context: {
                    status: `M  README.md
A  src/index.ts
?? temp.txt`
                },
                options: {
                    format: "conventional",
                    commit_strategy: "single"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    }, 30000);

    it('should accept valid git log context', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Added description`,
                context: {
                    log: `abc1234 feat: initial commit
def5678 docs: add readme
fab9abc fix: resolve bug`
                },
                options: {
                    format: "conventional",
                    commit_strategy: "single"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    }, 30000);

    it('should accept context with both status and log', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/src/utils.ts b/src/utils.ts
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1 +1,3 @@
 export function helper() {}
+export function format() {}
+export function parse() {}`,
                context: {
                    status: `M  src/utils.ts`,
                    log: `abc1234 refactor: improve helpers
def5678 feat: add utils module`
                },
                options: {
                    format: "conventional",
                    commit_strategy: "single"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.mode).toBe("single");
    }, 30000);

    it('should reject invalid git status format', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Added description`,
                context: {
                    status: "this is not valid git status output"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid git log format', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: `diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Project
+Added description`,
                context: {
                    log: "invalid log without hash"
                }
            });

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

});
