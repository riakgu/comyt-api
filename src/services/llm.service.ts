import OpenAI from "openai";
import { config } from "../config";
import { logger } from "../config/logger";

const client = new OpenAI({
    baseURL: config.llm.baseUrl,
    apiKey: config.llm.apiKey,
});

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export class LlmService {

    static async chat(messages: ChatMessage[]): Promise<string> {
        try {
            const response = await client.chat.completions.create({
                model: config.llm.model,
                messages,
            });

            const content = response.choices[0]?.message?.content?.trim();

            if (!content) {
                throw new Error("LLM response is empty");
            }

            return content;
        } catch (error) {
            logger.error("LLM chat error", { error });
            throw error;
        }
    }

}