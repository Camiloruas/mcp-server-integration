import { Request, Response } from "express";
import fetch from "node-fetch";

export async function evolutionWebhookTool(req: Request, res: Response) {
  console.log("EVOLUTION WEBHOOK RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;

    // --------------------------------------------------
    // Validação do secret do webhook (CAMADA DE SEGURANÇA)
    // Aceita:
    // - secret via query (?secret=)
    // - secret via body (compatível com outros providers)
    // --------------------------------------------------
    const expectedSecret = process.env.EVOLUTION_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.warn("⚠️ EVOLUTION_WEBHOOK_SECRET not configured");
      return res.status(500).json({ ok: false });
    }

    const receivedSecret = typeof req.query.secret === "string" ? req.query.secret : event?.secret;

    if (receivedSecret !== expectedSecret) {
      console.warn("⚠️ Invalid Evolution webhook secret");
      return res.status(403).json({ ok: false });
    }

    // --------------------------------------------------
    // Validação mínima do payload
    // --------------------------------------------------
    if (!event || !event.event) {
      console.warn("⚠️ Invalid Evolution payload (missing event)");
      return res.status(400).json({ ok: false });
    }

    // --------------------------------------------------
    // Normalização do payload
    // --------------------------------------------------
    const payload = {
      source: "evolution",
      event: event.event,
      instance: event.instance || null,
      data: event.data || event,
    };

    // --------------------------------------------------
    // Forward para o n8n
    // --------------------------------------------------
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "mcp-server",
          action: "evolution-event",
          data: payload,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error("❌ Error forwarding to n8n:", err.message);
      });
    } else {
      console.warn("⚠️ N8N_WEBHOOK_URL not configured, skipping forward to n8n");
    }

    // --------------------------------------------------
    // Sempre responder 200 para a Evolution
    // --------------------------------------------------
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Evolution webhook error:", err);
    return res.status(200).json({ ok: true });
  }
}
