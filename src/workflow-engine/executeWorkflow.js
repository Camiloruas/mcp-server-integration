import fetch from "node-fetch";

export async function executeWorkflow(workflow, context = {}) {
  const stepsMap = new Map();
  let currentStepId = workflow.steps[0].id;
  let lastOutput = null;

  context.input = context.input || {};
  context.state = context.state || {};

  for (const step of workflow.steps) {
    stepsMap.set(step.id, step);
  }

  while (currentStepId) {
    const step = stepsMap.get(currentStepId);
    if (!step) {
      throw new Error(`Step '${currentStepId}' not found`);
    }

    switch (step.type) {
      case "condition": {
        const result = evaluateCondition(step.expression, context);
        currentStepId = result ? step.onTrue : step.onFalse;
        break;
      }

      case "transform": {
        applyTransform(step.action, context);
        currentStepId = step.next;
        break;
      }

      case "request": {
        const response = await executeRequest(step, context);
        context.state[step.saveAs] = response;
        currentStepId = step.next;
        break;
      }

      case "respond": {
        lastOutput = resolvePayload(step.payload, context);
        return lastOutput;
      }

      default:
        throw new Error(`Unsupported step type: ${step.type}`);
    }
  }

  return lastOutput;
}

/* =========================
   CONDITIONS
========================= */
function evaluateCondition(expression, context) {
  switch (expression) {
    case "hasMessage":
      return Boolean(context.input?.message);
    default:
      throw new Error(`Unknown condition: ${expression}`);
  }
}

/* =========================
   TRANSFORMS
========================= */
function applyTransform(action, context) {
  switch (action) {
    case "uppercaseMessage":
      context.state.message = String(context.input.message).toUpperCase();
      break;
    default:
      throw new Error(`Unknown transform: ${action}`);
  }
}

/* =========================
   REQUEST
========================= */
async function executeRequest(step) {
  const response = await fetch(step.url, {
    method: step.method || "GET",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/* =========================
   PAYLOAD
========================= */
function resolvePayload(payload, context) {
  const resolved = {};

  for (const key in payload) {
    const value = payload[key];

    if (typeof value === "string" && value.startsWith("{{")) {
      const field = value.replace(/[{}]/g, "");
      resolved[key] = context.state[field] ?? context.input[field];
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}
