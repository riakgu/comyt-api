import dotenv from "dotenv";
dotenv.config();

export const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || "development",
    },
    llm: {
        baseUrl: process.env.LLM_BASE_URL || "https://api.deepinfra.com/v1/openai",
        apiKey: process.env.LLM_API_KEY || "",
        model: process.env.LLM_MODEL || "openai/gpt-oss-120b",
    },
    redis: {
        url: process.env.REDIS_URL || "redis://localhost:6379",
    },
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        max: Number(process.env.RATE_LIMIT_MAX) || 10,
    },
};