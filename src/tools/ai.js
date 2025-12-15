import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function aiTool(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing 'prompt' field",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return res.json({
      tool: "ai",
      status: "ok",
      prompt,
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI TOOL ERROR:", error);

    return res.status(500).json({
      tool: "ai",
      status: "error",
      message: error.message,
    });
  }
}
