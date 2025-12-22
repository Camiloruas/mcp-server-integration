export async function translateTool(req, res) {
  const { tool, input } = req.body;

  if (tool !== "translate") {
    return res.status(400).json({
      error: "Invalid tool",
    });
  }

  if (!input?.text || !input?.from || !input?.to) {
    return res.status(400).json({
      error: "Invalid input payload",
    });
  }

  // MOCK simples (por enquanto)
  const mockDictionary = {
    "Olá mundo": "Hello world",
    "Bom dia": "Good morning",
    "Boa noite": "Good night",
  };

  const translatedText = mockDictionary[input.text] || `[${input.to}] ${input.text}`;

  return res.json({
    tool: "translate",
    result: {
      text: translatedText,
      from: input.from,
      to: input.to,
    },
    timestamp: new Date().toISOString(),
  });
}
