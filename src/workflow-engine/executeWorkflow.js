export async function executeWorkflow(workflow, context = {}) {
  const stepsMap = new Map();
  let currentStepId = workflow.steps[0].id;
  let lastOutput = null;

  // Indexa os steps por ID
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
        const conditionResult = evaluateCondition(step.expression, context);

        currentStepId = conditionResult ? step.onTrue : step.onFalse;
        break;
      }

      case "respond": {
        lastOutput = step.payload;
        return lastOutput;
      }

      default:
        throw new Error(`Unsupported step type: ${step.type}`);
    }
  }

  return lastOutput;
}

/**
 * Avalia condições conhecidas
 * (simples e seguro)
 */
function evaluateCondition(expression, context) {
  switch (expression) {
    case "hasMessage":
      return Boolean(context.input?.message);

    default:
      throw new Error(`Unknown condition: ${expression}`);
  }
}
