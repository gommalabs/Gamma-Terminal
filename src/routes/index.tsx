import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const TerminalApp = lazy(() => import("@/TerminalApp"));

export const Route = createFileRoute("/")({
  component: Index,
  ssr: false,
});

function Index() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-black text-amber-400 font-mono text-sm tracking-widest">
          LOADING GAMMA TERMINAL…
        </div>
      }
    >
      <TerminalApp />
    </Suspense>
  );
}
