import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { streamAI } from "@/lib/ai-client";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Summarise a topic, pasted text or a URL into key insights and practical workplace recommendations, generated live by AI and fully editable.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Get an AI summary, key insights and recommendations from any topic, text or link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Research,
});

const SYSTEM = `You are a rigorous workplace research analyst.
Analyse only the material the user supplies (a topic, pasted text, or a URL and its subject).
Return plain text with exactly these three headed sections:
SUMMARY
KEY INSIGHTS
RECOMMENDATIONS
Use concise sentences and hyphen bullets under the last two sections.
Ground every statement in the supplied material or clearly flag it as an assumption.
If you cannot access a URL's content, say so in one line and analyse what its topic implies, flagging uncertainty.
No markdown symbols, no preamble, no closing commentary.`;

type Mode = "topic" | "text" | "url";

function Research() {
  const [mode, setMode] = useState<Mode>("topic");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const value = mode === "topic" ? topic : mode === "text" ? text : url;
  const canSubmit = value.trim().length > 0 && !loading;

  async function generate() {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const label =
        mode === "topic" ? "Research topic" : mode === "text" ? "Source text to analyse" : "Source URL";
      await streamAI({
        system: SYSTEM,
        input: `${label}:\n${value}`,
        onDelta: (chunk) => setResult((prev) => prev + chunk),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AppShell
      title="AI Research Assistant"
      description="Turn a topic, document or link into insights you can act on."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel-card p-5 md:p-6">
          <h2 className="text-sm font-semibold text-foreground">Source</h2>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="topic" className="flex-1">
                Topic
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                Paste text
              </TabsTrigger>
              <TabsTrigger value="url" className="flex-1">
                URL
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-5 space-y-4">
            {mode === "topic" ? (
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or question</Label>
                <Textarea
                  id="topic"
                  rows={6}
                  placeholder="Hybrid work policies for mid-size engineering teams"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            ) : null}

            {mode === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="text">Text to analyse</Label>
                <Textarea
                  id="text"
                  rows={12}
                  placeholder="Paste a report, meeting notes, contract clause or article…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            ) : null}

            {mode === "url" ? (
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If the page cannot be read, the assistant will say so instead of inventing content.
                </p>
              </div>
            ) : null}

            <Button onClick={generate} disabled={!canSubmit} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Analysing…
                </>
              ) : (
                "Run research"
              )}
            </Button>
          </div>
        </section>

        <section className="panel-card flex flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">Findings (editable)</h2>
            {result && !loading ? (
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            ) : null}
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {loading && !result ? (
            <div className="mt-4 space-y-2">
              <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
            </div>
          ) : null}

          <Textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Summary, key insights and recommendations will appear here."
            className="mt-4 min-h-[460px] flex-1 leading-relaxed"
          />
        </section>
      </div>
    </AppShell>
  );
}
