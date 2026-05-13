import { useEffect, useState } from "react";
import { useWorkspace } from "@/store/workspaceStore";

export function QuickBar() {
  const { openTab } = useWorkspace();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickFunctions = [
    { key: "F1", code: "HELP", label: "HELP" },
    { key: "F2", code: "CC", label: "CMD" },
    { key: "F3", code: "DES", label: "DESC" },
    { key: "F4", code: "HP", label: "CHART" },
    { key: "F5", code: "FA", label: "FA" },
    { key: "F6", code: "KEY", label: "KEYS" },
    { key: "F7", code: "SCORECARD", label: "SCORE" },
    { key: "F8", code: "MOV", label: "MOVIES" },
    { key: "F9", code: "CRYPTO", label: "CRYPTO" },
    { key: "F10", code: "WEI", label: "WEI" },
    { key: "F11", code: "NI", label: "NEWS" },
    { key: "F12", code: "SETTINGS", label: "SETUP" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith("F") && e.key.length <= 3) {
        const fKeyNum = parseInt(e.key.substring(1));
        if (fKeyNum >= 1 && fKeyNum <= 12) {
          e.preventDefault();
          const func = quickFunctions[fKeyNum - 1];
          if (func) {
            openTab(func.code as any);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openTab]);

  return (
    <div className="flex items-center justify-between h-6 px-2 bg-term-panel border-t border-term-border-strong">
      <div className="flex items-center gap-1">
        {quickFunctions.map((func) => (
          <button
            key={func.key}
            onClick={() => openTab(func.code as any)}
            className="bb-fkey hover:bg-term-amberSubtle hover:border-term-amber cursor-pointer"
            title={`${func.key} - ${func.label}`}
          >
            {func.key}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3 text-[7px] uppercase tracking-wider text-term-textDim num">
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
