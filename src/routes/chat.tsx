import { createFileRoute } from "@tanstack/react-router";
import { Loader2, SendHorizonal, User, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-client";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Ask workplace questions and get real-time AI answers on communication, planning, processes and professional writing.",
      },
      { property: "og:title", content: "AI Workplace Chat | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "A live AI assistant for everyday workplace questions and tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chat;
});

const SYSTEM = `You are a professional workplace productivity assistant.
Answer the user's workplace questions and tasks directly, in plain text, with a concise, businesslike tone.
Structure longer answers with short paragraphs or hyphen bullets.
Base answers on what the user actually asked; ask one clarifying question only when the request cannot be answered otherwise.
Never invent company-specific facts, policies, names or figures. Do not give legal, medical or financial advice as if authoritative — flag when professional review is needed.`;

type Message = { role: "user" | "assistant"; content: string };

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const prompt = input.trim();
    if (!prompt || loading) return;
    const history: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      await streamAI({
        system: SYSTEM,
        input: history,
        onDelta: (chunk) =>
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = { role: "assistant", content: last.content + chunk };
            }
            return next;
          }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI generation failed. Please try again.");
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.content === "")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="AI Workplace Chat"
      description="Ask anything about your work — answers are generated live."
    >
      <div className="panel-card flex h-[calc(100vh-16rem)] min-h-[480px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                <Bot className="size-5 text-muted-foreground" />
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                Start a workplace conversation
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask about meeting agendas, difficult feedback, process improvements, prioritisation
                or professional wording.
              </p>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  m.role === "user" ? "bg-muted" : "bg-primary"
                }`}
              >
                {m.role === "user" ? (
                  <User className="size-4 text-muted-foreground" />
                ) : (
                  <Bot className="size-4 text-primary-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {m.role === "user" ? "You" : "Assistant"}
                </p>
                <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.content ||
                    (loading && i === messages.length - 1 ? (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-3.5 animate-spin" /> Thinking…
                      </span>
                    ) : null)}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {error ? (
          <p className="mx-5 mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive md:mx-6">
            {error}
          </p>
        ) : null}

        <div className="border-t border-border p-4 md:p-5">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder="Ask a workplace question…"
              className="max-h-40 min-h-11 resize-none"
            />
            <Button onClick={send} disabled={loading || input.trim().length === 0} className="h-11">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Conversations are not saved and disappear when you leave the page.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
