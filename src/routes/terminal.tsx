import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const TerminalApp = lazy(() => import("@/TerminalApp"));

export const Route = createFileRoute("/terminal")({
  component: TerminalRoute,
  ssr: false,
});

function TerminalRoute() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-term-black text-term-amber font-mono text-xs tracking-widest">
          INITIALIZING TERMINAL…
        </div>
      }
    >
      <TerminalApp />
    </Suspense>
  );
}
