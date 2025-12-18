import { n8nTool } from "./n8n.js";

export async function evolutionWebhookTool(req, res) {
  console.log("EVOLUTION WEBHOOK RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;

    if (!event || !event.event) {
      console.warn("⚠️ Invalid Evolution payload");
      return res.status(400).json({ ok: false });
    }

    const payload = {
      source: "evolution",
      event: event.event,
      instance: event.instance || null,
      data: event.data || event,
    };

    n8nTool({
      action: "evolution-event",
      data: payload,
    }).catch((err) => {
      console.error(" Error forwarding to n8n:", err.message);
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(" Evolution webhook error:", err);
    return res.status(200).json({ ok: true });
  }
}
