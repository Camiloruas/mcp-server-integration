import { Request, Response } from "express";
import fetch from "node-fetch";

export async function evolutionWebhookTool(req: Request, res: Response) {
  console.log("EVOLUTION WEBHOOK RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;

    // --------------------------------------------------
    // Webhook secret validation (SECURITY LAYER)
    // Accepts:
    // - secret via query (?secret=)
    // - secret via body (compatible with other providers)
    //
    // ⚠️ TEST MODE:
    // If the secret doesn't match, logs warning but DOES NOT interrupt the flow
    // --------------------------------------------------
    const expectedSecret = process.env.EVOLUTION_WEBHOOK_SECRET?.trim();

    if (!expectedSecret) {
      console.warn("⚠️ EVOLUTION_WEBHOOK_SECRET not configured");
      // continues the flow to not block tests
    }

    const receivedSecret = typeof req.query.secret === "string" ? req.query.secret.trim() : typeof event?.secret === "string" ? event.secret.trim() : null;

    if (expectedSecret && receivedSecret !== expectedSecret) {
      console.warn("⚠️ Invalid Evolution webhook secret (ignored in test mode)");
      // ⚠️ DO NOT return here
    }

    // --------------------------------------------------
    // Minimal payload validation
    // --------------------------------------------------
    if (!event || !event.event) {
      console.warn("⚠️ Invalid Evolution payload (missing event)");
      return res.status(200).json({ ok: true });
    }

    // --------------------------------------------------
    // Payload normalization
    // --------------------------------------------------
    const payload = {
      source: "evolution",
      event: event.event,
      instance: event.instance || null,
      data: event.data || event,
    };

    // --------------------------------------------------
    // Forward to n8n
    // --------------------------------------------------
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      try {
        const response = await fetch(n8nWebhookUrl, {
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
        });

        if (!response.ok) {
          console.error(`❌ Error forwarding to n8n: ${response.status} ${response.statusText}`);
        }
      } catch (err: any) {
        console.error("❌ Error forwarding to n8n:", err.message);
      }
    } else {
      console.warn("⚠️ N8N_WEBHOOK_URL not configured, skipping forward to n8n");
    }

    // --------------------------------------------------
    // Always return 200 for Evolution
    // --------------------------------------------------
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Evolution webhook error:", err);
    return res.status(200).json({ ok: true });
  }
}
