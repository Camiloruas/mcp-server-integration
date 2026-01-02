interface SummarizeInput {
  text: string;
  max_sentences?: number;
}

export async function summarizeTool(input: SummarizeInput) {
  const max = input.max_sentences ?? 3;

  const sentences = input.text
    .split(".")
    .map(s => s.trim())
    .filter(Boolean);

  const summary = sentences.slice(0, max).join(". ") + ".";

  return {
    summary
  };
}
