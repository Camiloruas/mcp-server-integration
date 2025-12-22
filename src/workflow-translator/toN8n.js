export function translateWorkflowToN8n(workflow) {
  const nodes = [];
  const connections = {};

  /* =========================
     1️⃣ Manual Trigger
  ========================= */
  const triggerNode = {
    id: "manual-trigger",
    name: "Manual Trigger",
    type: "n8n-nodes-base.manualTrigger",
    typeVersion: 1,
    position: [200, 300],
    parameters: {}
  };

  nodes.push(triggerNode);

  /* =========================
     2️⃣ Traduzir steps
  ========================= */
  let previousNodeName = triggerNode.name;

  for (const step of workflow.steps) {
    let node;

    if (step.type === "condition") {
      node = {
        id: step.id,
        name: step.id,
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [400, 300],
        parameters: {
          conditions: {
            boolean: [
              {
                value1: true,
                operation: "equal",
                value2: true
              }
            ]
          }
        }
      };
    }

    if (step.type === "respond") {
      node = {
        id: step.id,
        name: step.id,
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        position: [600, 300],
        parameters: {
          values: {
            string: [
              {
                name: "message",
                value: step.payload.message || ""
              }
            ]
          }
        }
      };
    }

    if (!node) continue;

    nodes.push(node);

    connections[previousNodeName] = {
      main: [[{ node: node.name, type: "main", index: 0 }]]
    };

    previousNodeName = node.name;
  }

  /* =========================
     3️⃣ Workflow final
  ========================= */
  return {
    name: workflow.metadata.name,
    nodes,
    connections,
    active: false,
    settings: {}
  };
}
s