import dotenv from "dotenv";
dotenv.config();

export const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || "development",
    },
    llm: {
        baseUrl: process.env.AI_BASE_URL || "https://api.deepinfra.com/v1/openai",
        apiKey: process.env.AI_API_KEY || "",
        model: process.env.AI_MODEL || "openai/gpt-oss-120b",
    },
};