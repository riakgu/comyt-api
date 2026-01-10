import supertest from "supertest";
import { app } from "../src/config/express";

describe('POST /api/commits/generate', () => {

    it('should be able to generate commit message', async () => {
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
 }`
            });

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.message).toBeDefined();
        expect(typeof response.body.data.message).toBe('string');
    }, 30000);

    it('should reject if diff is empty', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({
                diff: ""
            });

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Validation Error");
        expect(response.body.details).toBeDefined();
    });

    it('should reject if diff is missing', async () => {
        const response = await supertest(app)
            .post('/api/commits/generate')
            .send({});

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Validation Error");
        expect(response.body.details).toBeDefined();
    });

});
