import fetch from "node-fetch";

export async function aiTool(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      tool: "ai",
      status: "error",
      message: "Missing 'prompt' field",
    });
  }

  const AI_MODE = process.env.AI_MODE || "mock";

  /* =========================
      MODO MOCK (default)
     ========================= */
  if (AI_MODE === "mock") {
    return res.json({
      tool: "ai",
      status: "ok",
      mode: "mock",
      prompt,
      response: "IA mock funcionando",
    });
  }

  /* =========================
      MODO OPENAI REAL
     ========================= */
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        tool: "ai",
        status: "error",
        message: "OPENAI_API_KEY not configured",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um assistente técnico." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        tool: "ai",
        status: "error",
        openaiError: data,
      });
    }

    return res.json({
      tool: "ai",
      status: "ok",
      mode: "openai",
      prompt,
      response: data.choices?.[0]?.message?.content || "",
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
