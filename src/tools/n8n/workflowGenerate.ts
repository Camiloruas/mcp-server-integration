import { Request, Response } from "express";
import fetch from "node-fetch";
import { McpToolRequest, WorkflowInput } from "../../types/mcp.js";

export async function workflowGenerateTool(req: Request<{}, {}, McpToolRequest<WorkflowInput>>, res: Response) {
  try {
    const { input } = req.body || {};
    // Input can be undefined if body is malformed, but assuming middleware json

    if (!input) {
      return res.status(400).json({
        tool: "workflow-generate",
        status: "error",
        message: "Missing input object",
      });
    }

    const { name, nodes, connections, settings } = input;

    if (!nodes || !connections) {
      return res.status(400).json({
        tool: "workflow-generate",
        status: "error",
        message: "nodes and connections are required",
      });
    }

    // ❌ CANNOT send `active` here
    const workflow = {
      name: name || `workflow-generated-${Date.now()}`,
      nodes,
      connections,
      settings: settings || {},
    };

    console.log(`[workflowGenerate] Creating workflow: ${workflow.name}`);

    // 1️⃣ Creates the workflow
    const response = await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`n8n error: ${text}`);
    }

    const data: any = await response.json();

    // 2️⃣ ACTIVATES the workflow (separate call — this is allowed)
    try {
      await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows/${data.id}/activate`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": process.env.N8N_API_KEY || "",
        },
      });
    } catch (activateErr) {
      console.warn(`[workflowGenerate] Workflow created but not activated: ${(activateErr as Error).message}`);
    }

    // 3️⃣ Assembles webhook URL (your logic preserved)
    let webhookUrl = null;
    const webhookNode = nodes.find((n: any) => n.type?.includes("webhook"));

    if (webhookNode) {
      const path = webhookNode.parameters?.path || "";
      if (path) {
        webhookUrl = `${process.env.N8N_WEBHOOK_URL}/${path}`;
      }
    }

    res.json({
      tool: "workflow-generate",
      status: "ok",
      workflowId: data.id,
      name: data.name,
      webhookUrl: webhookUrl || "Check n8n UI for details",
      active: true,
    });
  } catch (err) {
    console.error("workflowGenerate error:", err);

    res.status(500).json({
      tool: "workflow-generate",
      status: "error",
      message: (err as Error).message,
    });
  }
}
