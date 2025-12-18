import { n8nTool } from "./n8n.js";

export async function evolutionWebhookTool(req, res) {
  try {
    const event = req.body;

    // Validação mínima
    if (!event || !event.event) {
      return res.status(400).json({ ok: false, error: "Invalid payload" });
    }

    // Normalização básica
    const payload = {
      source: "evolution",
      event: event.event,
      instance: event.instance || null,
      data: event.data || event
    };

    // Envia para o n8n (não bloqueante)
    n8nTool({
      action: "evolution-event",
      data: payload
    }).catch(err => {
      console.error("N8N forward error:", err.message);
    });

    // Resposta IMEDIATA para a Evolution
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Evolution webhook error:", err);
    // Sempre 200 para evitar retry agressivo
    return res.status(200).json({ ok: true });
  }
}
