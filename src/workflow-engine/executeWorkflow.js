export async function executeWorkflow(workflow, context = {}) {
  let result = null;

  for (const step of workflow.steps) {
    if (step.type === "respond") {
      result = step.payload;
      break;
    }
  }

  return result;
}
