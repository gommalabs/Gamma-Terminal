import { useState, useEffect, useRef } from "react";
import { useWorkspace } from "@/store/workspaceStore";
import { FUNCTIONS, parseCommand, type FunctionCode } from "@/lib/functions";
import { Search, X } from "lucide-react";

interface Suggestion {
  code: FunctionCode;
  name: string;
  symbol?: string;
  matchType: "function" | "symbol" | "full";
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openTab, activeSymbol } = useWorkspace();

  // Listen for ':' key to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette with ':'
      if (e.key === ":" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setIsOpen(true);
        setInput("");
        setSuggestions([]);
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInput("");
        setSuggestions([]);
        return;
      }

      // Navigate suggestions
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter" && suggestions.length > 0) {
          e.preventDefault();
          executeCommand(suggestions[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, selectedIndex]);

  // Generate suggestions based on input
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const raw = input.trim().toUpperCase();
    const parts = raw.split(/\s+/).filter(Boolean);
    const newSuggestions: Suggestion[] = [];

    // If single token, check if it's a function or symbol
    if (parts.length === 1) {
      const token = parts[0];

      // Match functions
      const funcMatches = FUNCTIONS.filter(f =>
        f.code.startsWith(token) || f.name.toUpperCase().includes(token)
      ).map(f => ({
        code: f.code,
        name: f.name,
        matchType: "function" as const
      }));

      newSuggestions.push(...funcMatches);

      // Add symbol suggestion (defaults to SCORECARD)
      if (token.length >= 2) {
        newSuggestions.push({
          code: "SCORECARD",
          name: `${token} - Stock Scorecard`,
          symbol: token,
          matchType: "symbol" as const
        });
      }
    } else if (parts.length >= 2) {
      // Two tokens: SYMBOL FUNCTION or FUNCTION SYMBOL
      const parsed = parseCommand(raw, activeSymbol);
      if (parsed) {
        const fn = FUNCTIONS.find(f => f.code === parsed.code);
        if (fn) {
          newSuggestions.push({
            code: parsed.code,
            name: `${parsed.symbol || ""} - ${fn.name}`,
            symbol: parsed.symbol,
            matchType: "full" as const
          });
        }
      }
    }

    setSuggestions(newSuggestions.slice(0, 8));
    setSelectedIndex(0);
  }, [input, activeSymbol]);

  const executeCommand = (suggestion: Suggestion) => {
    openTab(suggestion.code, suggestion.symbol);
    setIsOpen(false);
    setInput("");
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      executeCommand(suggestions[selectedIndex]);
    } else if (input.trim()) {
      // Default to SCORECARD view for unknown input
      openTab("SCORECARD", input.trim().toUpperCase());
      setIsOpen(false);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black border border-orange-800 rounded-lg shadow-2xl shadow-orange-900/20 overflow-hidden">
        {/* Input area */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-orange-900/50 bg-gradient-to-r from-orange-950/30 to-black">
          <span className="text-amber-400 font-bold text-xl">:</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command or symbol... (e.g., AAPL, MOV, TSLA FA)"
              className="w-full bg-transparent text-amber-400 placeholder-orange-800 focus:outline-none text-base font-mono uppercase tracking-wider"
              autoFocus
            />
          </form>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-orange-950 rounded transition-colors"
          >
            <X size={16} className="text-orange-700 hover:text-amber-400" />
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto bg-black">
            {suggestions.map((suggestion, idx) => {
              const fn = FUNCTIONS.find(f => f.code === suggestion.code);
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={`${suggestion.code}-${suggestion.symbol || ""}-${idx}`}
                  onClick={() => executeCommand(suggestion)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-4 py-3 flex items-center gap-4 border-b border-orange-900/30 transition-colors ${
                    isSelected
                      ? "bg-orange-950/50 text-amber-400"
                      : "text-orange-600 hover:bg-orange-950/30 hover:text-amber-400"
                  }`}
                >
                  <span className="font-bold text-amber-400 min-w-[80px] text-left">
                    {suggestion.code}
                  </span>
                  <span className="flex-1 text-left text-sm">
                    {suggestion.name}
                  </span>
                  {fn && (
                    <span className="text-[10px] uppercase tracking-wider text-orange-700">
                      {fn.group}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Help text */}
        {!input && (
          <div className="px-4 py-3 bg-orange-950/20 border-t border-orange-900/30">
            <div className="text-[10px] uppercase tracking-wider text-orange-700 mb-2">
              Quick Commands:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-orange-600">
              <div><span className="text-amber-400 font-bold">AAPL</span> - Open stock scorecard</div>
              <div><span className="text-amber-400 font-bold">MOV</span> - Market movers</div>
              <div><span className="text-amber-400 font-bold">WEI</span> - World indices</div>
              <div><span className="text-amber-400 font-bold">SETTINGS</span> - Settings</div>
            </div>
          </div>
        )}

        {/* Keyboard hints */}
        <div className="px-4 py-2 bg-black border-t border-orange-900/30 flex items-center justify-between text-[10px] text-orange-700 uppercase tracking-wider">
          <span>↑↓ navigate</span>
          <span>ENTER select</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
