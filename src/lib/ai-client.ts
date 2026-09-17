export type StreamArgs = {
  system: string;
  input: string | Array<{ role: "user" | "assistant"; content: string }>;
  onDelta: (chunk: string) => void;
  signal?: AbortSignal | undefined;
};

export async function streamAI({ system, input, onDelta, signal }: StreamArgs): Promise<string> {
  const payload =
    typeof input === "string"
      ? input
      : input.map((m) => ({
          role: m.role,
          content: [
            {
              type: m.role === "assistant" ? "output_text" : "input_text",
              text: m.content,
            },
          ],
        }));

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, input: payload }),
    ...(signal ? { signal } : {}),
  });

  if (!res.ok || !res.body) {
    const message = (await res.text().catch(() => "")) || "AI generation failed. Please try again.";
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      full += chunk;
      onDelta(chunk);
    }
  }

  if (!full.trim()) {
    throw new Error("The AI returned an empty response. Please refine your input and try again.");
  }
  return full;
}
