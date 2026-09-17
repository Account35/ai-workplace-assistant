import { Link, useRouterState } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, Menu, ShieldAlert, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <div className="mb-6 flex items-center gap-2.5 px-1">
        <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-accent">
          <Sparkles className="size-4 text-sidebar-accent-foreground" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">Workplace AI</p>
          <p className="text-xs text-sidebar-foreground/60">Productivity Assistant</p>
        </div>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-md border border-sidebar-border p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
          <ShieldAlert className="size-3.5" /> Responsible AI
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-sidebar-foreground/60">
          Always review AI-generated content for accuracy and confidentiality before using it
          professionally. Nothing you enter is stored.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <SidebarInner />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-none p-0">
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground md:text-lg">{title}</h1>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-4 md:px-8">
          <p className="mx-auto max-w-6xl text-xs leading-relaxed text-muted-foreground">
            AI-generated output can be inaccurate or incomplete. Review and edit everything before
            sending or publishing. This app does not store your inputs or results.
          </p>
        </footer>
      </div>
    </div>
  );
}
