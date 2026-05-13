import { useEffect, useRef, useState } from "react";
import { parseCommand, FUNCTIONS } from "@/lib/functions";
import { useWorkspace } from "@/store/workspaceStore";
import { cn } from "@/lib/cn";

export function CommandBar() {
  const [input, setInput] = useState("");
  const [suggestIdx, setSuggestIdx] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { openTab, activeSymbol } = useWorkspace();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Suggestions based on current token
  const tokens = input.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const last = tokens[tokens.length - 1] ?? "";
  const suggestions =
    tokens.length === 0
      ? []
      : FUNCTIONS.filter((f) => f.code.startsWith(last)).slice(0, 5);

  function run() {
    const raw = input.trim();
    if (!raw) return;
    const parsed = parseCommand(raw, activeSymbol);
    if (!parsed) {
      setErr("UNKNOWN COMMAND — TRY: HELP");
      return;
    }
    openTab(parsed.code, parsed.symbol);
    setHistory((h) => [raw.toUpperCase(), ...h].slice(0, 20));
    setHistIdx(null);
    setInput("");
    setErr(null);
  }

  return (
    <div className="flex items-center h-7 bg-term-panel border-b border-term-border-strong px-2 gap-2">
      {/* Terminal branding */}
      <div className="flex items-center gap-2 select-none shrink-0">
        <span className="w-1 h-1 bg-term-amber animate-pulse" />
        <span className="text-term-amber font-bold tracking-[0.25em] text-[8px]">CMD</span>
      </div>
  
      {/* Command input - dense */}
      <div className="flex items-center gap-1 flex-1 relative min-w-0">
        <span className="text-term-amber text-[9px] font-bold">&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setErr(null); setSuggestIdx(0); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (history.length === 0) return;
              const next = histIdx == null ? 0 : Math.min(history.length - 1, histIdx + 1);
              setHistIdx(next); setInput(history[next]);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              if (histIdx == null) return;
              const next = histIdx - 1;
              if (next < 0) { setHistIdx(null); setInput(""); }
              else { setHistIdx(next); setInput(history[next]); }
            } else if (e.key === "Tab" && suggestions.length > 0) {
              e.preventDefault();
              const rest = tokens.slice(0, -1);
              setInput([...rest, suggestions[suggestIdx].code].join(" ") + " ");
            }
          }}
          placeholder="AAPL | TSLA SCORECARD | CC | WEI | MOV | SETTINGS"
          spellCheck={false}
          autoCapitalize="characters"
          className="flex-1 bg-transparent uppercase text-term-text placeholder:text-term-muted focus:outline-none text-[10px] tracking-wider min-w-0"
        />
        <span className="bb-fkey cursor-pointer hover:bg-term-amberSubtle" onClick={run}>
          GO
        </span>
  
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-term-panel border border-term-border-strong shadow-lg min-w-[320px]">
            {suggestions.map((f, i) => (
              <div
                key={f.code}
                onMouseEnter={() => setSuggestIdx(i)}
                onClick={() => { setInput(f.code + " "); inputRef.current?.focus(); }}
                className={
                  i === suggestIdx
                    ? "flex items-baseline gap-2 px-2 py-1 text-[9px] cursor-pointer bg-term-amberSubtle text-term-amber"
                    : "flex items-baseline gap-2 px-2 py-1 text-[9px] cursor-pointer hover:bg-term-panel2"
                }
              >
                <span className="text-term-amber font-bold w-12">{f.code}</span>
                <span className="text-term-text flex-1 truncate">{f.name}</span>
                <span className="text-term-textDim text-[7px] uppercase">{f.group}</span>
              </div>
            ))}
          </div>
        )}
      </div>
  
      {/* Right status indicators */}
      <div className="flex items-center gap-2 text-[7px] uppercase tracking-wider text-term-textDim shrink-0">
        {err && <span className="text-term-red font-bold">{err}</span>}
        <span>CTX:</span>
        <span className="text-term-amber font-bold">{activeSymbol ?? "—"}</span>
        <span className="text-term-muted">|</span>
        <span className="hidden md:inline">↑↓ HIST ⇥ AUTO</span>
      </div>
    </div>
  );
}
