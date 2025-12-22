export function translateWorkflowToN8n(workflow) {
  const nodes = [];
  const connections = {};

  /* =========================
     INDEXAR STEPS
  ========================= */
  const stepsMap = new Map();
  for (const step of workflow.steps) {
    stepsMap.set(step.id, step);
  }

  /* =========================
     MANUAL TRIGGER
  ========================= */
  const triggerNode = {
    id: "manual-trigger",
    name: "Manual Trigger",
    type: "n8n-nodes-base.manualTrigger",
    typeVersion: 1,
    position: [200, 300],
    parameters: {},
  };

  nodes.push(triggerNode);

  /* =========================
     CRIAR NODES
  ========================= */
  const nodeByStepId = {};
  let x = 400;

  for (const step of workflow.steps) {
    let node;

    /* -------- IF -------- */
    if (step.type === "condition") {
      node = {
        id: step.id,
        name: step.id,
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [x, 300],
        parameters: {
          conditions: {
            string: [
              {
                value1: "={{$json.message}}",
                operation: "notEmpty",
              },
            ],
          },
        },
      };
    }

    /* -------- REQUEST -------- */
    if (step.type === "request") {
      node = {
        id: step.id,
        name: step.id,
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4,
        position: [x, 300],
        parameters: {
          url: step.url,
          requestMethod: step.method || "GET",
          responseFormat: "json",
        },
      };
    }

    /* -------- RESPOND -------- */
    if (step.type === "respond") {
      node = {
        id: step.id,
        name: step.id,
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        position: [x, 150],
        parameters: {
          values: {
            string: [
              {
                name: "message",
                value: step.payload.message,
              },
            ],
          },
        },
      };
    }

    if (!node) continue;

    nodes.push(node);
    nodeByStepId[step.id] = node;
    x += 200;
  }

  /* =========================
     CONEXÕES
  ========================= */

  // Trigger → primeiro step
  connections["Manual Trigger"] = {
    main: [[{ node: workflow.steps[0].id, type: "main", index: 0 }]],
  };

  for (const step of workflow.steps) {
    if (step.type === "condition") {
      connections[step.id] = {
        main: [[{ node: step.onTrue, type: "main", index: 0 }], [{ node: step.onFalse, type: "main", index: 0 }]],
      };
    }

    if (step.type === "request") {
      connections[step.id] = {
        main: [[{ node: step.next, type: "main", index: 0 }]],
      };
    }
  }

  return {
    name: workflow.metadata.name,
    nodes,
    connections,
    active: false,
    settings: {},
  };
}
