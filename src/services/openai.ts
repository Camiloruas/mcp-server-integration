import OpenAI from "openai";

export interface OpenAIRequest {
    system: string;
    user: string;
    model?: string;
}

function getOpenAIClient(): OpenAI | null {
    if (process.env.AI_MODE !== "openai") return null;

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not configured");
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 30000, // 30 seconds
    });
}

export async function callOpenAI(input: OpenAIRequest): Promise<string | null> {
    const client = getOpenAIClient();
    if (!client) throw new Error("OpenAI client not available (check AI_MODE and API KEY)");

    const response = await client.chat.completions.create({
        model: input.model || process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.user },
        ],
        temperature: 0.4,
    });

    return response.choices[0].message.content;
}
