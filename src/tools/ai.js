import OpenAI from "openai";

const client = process.env.AI_MODE === "openai"
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function aiTool(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing 'prompt'"
    });
  }

  /* MODO MOCK */
  if (process.env.AI_MODE !== "openai") {
    return res.json({
      tool: "ai",
      status: "ok",
      mode: "mock",
      prompt,
      response: "IA mock funcionando"
    });
  }

  /* MODO OPENAI REAL */
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Você é um assistente técnico e objetivo." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    return res.json({
      tool: "ai",
      status: "ok",
      mode: "openai",
      prompt,
      response: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error.message);

    return res.status(502).json({
      tool: "ai",
      status: "error",
      message: "OpenAI request failed",
      details: error.message
    });
  }
}
