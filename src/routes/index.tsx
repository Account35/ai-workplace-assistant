import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in real time with AI. Choose a formal, friendly or persuasive tone and edit the result before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Turn a purpose, recipient and key points into a polished, editable workplace email using AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailGenerator,
});

const SYSTEM = `You are an expert workplace communication assistant.
Write a single complete email based strictly on the user's purpose, recipient context and key points.
Rules:
- Output plain text only: a "Subject:" line, then a blank line, then the email body with a suitable greeting and sign-off.
- Match the requested tone exactly.
- Cover every key point the user gave; never invent facts, names, dates, figures or commitments that were not provided.
- Where a detail is genuinely missing, use a clearly bracketed placeholder such as [date].
- No commentary, no markdown, no options list.`;

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = purpose.trim().length > 0 && points.trim().length > 0 && !loading;

  async function generate() {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      await streamAI({
        system: SYSTEM,
        input: `Tone: ${tone}
Purpose of the email: ${purpose}
Recipient and context: ${context || "Not specified"}
Key points to include:
${points}`,
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
      title="Smart Email Generator"
      description="Describe the situation and let AI draft the email for you."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel-card p-5 md:p-6">
          <h2 className="text-sm font-semibold text-foreground">Email brief</h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="Request a deadline extension for the Q3 audit"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Recipient &amp; context</Label>
              <Input
                id="context"
                placeholder="Finance director, external, first time contacting her"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={7}
                placeholder={"- Audit data arrived late\n- Need 5 extra working days\n- Offer interim summary on Friday"}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} disabled={!canSubmit} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating email…
                </>
              ) : (
                "Generate email"
              )}
            </Button>
          </div>
        </section>

        <section className="panel-card flex flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">Draft (editable)</h2>
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
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          ) : null}

          <Textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Your AI-generated email will appear here and stays fully editable."
            className="mt-4 min-h-[420px] flex-1 font-normal leading-relaxed"
          />
        </section>
      </div>
    </AppShell>
  );
}
