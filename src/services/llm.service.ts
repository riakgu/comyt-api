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

            const content = response.choices[0]?.message?.content;

            if (!content) {
                throw new Error("LLM response is empty");
            }

            return content;
        } catch (error) {
            logger.error("LLM chat error", { error });
            throw error;
        }
    }

    static async chatJson(messages: ChatMessage[], retry = 1): Promise<any> {
        const raw = await this.chat(messages);

        try {
            return JSON.parse(raw);
        } catch (err) {
            logger.warn("Invalid JSON from LLM", { raw });

            if (retry > 0) {
                return this.chatJson(
                    [
                        ...messages,
                        {
                            role: "user",
                            content:
                                "Your previous output was invalid. Output ONLY valid JSON. No extra text.",
                        },
                    ],
                    retry - 1
                );
            }

            throw new Error("Failed to parse JSON from LLM");
        }
    }

}