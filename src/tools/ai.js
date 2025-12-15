export async function aiTool(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing prompt",
    });
  }

  return res.json({
    tool: "ai",
    status: "ok",
    prompt,
    response: "IA mock funcionando ",
  });
}

