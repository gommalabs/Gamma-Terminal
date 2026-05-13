import { X } from "lucide-react";
import { useWorkspace } from "@/store/workspaceStore";
import { cn } from "@/lib/cn";

export function WorkspaceTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useWorkspace();

  return (
    <div className="flex h-5 bg-term-panel border-b border-term-border overflow-x-auto">
      {tabs.map((t) => {
        const isActive = t.id === activeTabId;
        const label = t.symbol ? `${t.code}:${t.symbol}` : t.code;
        return (
          <div
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={
              isActive
                ? "flex items-center gap-1 h-full px-2 cursor-pointer border-r border-term-border text-[8px] tracking-wider uppercase whitespace-nowrap bg-term-black text-term-amber border-t border-t-term-amber font-bold"
                : "flex items-center gap-1 h-full px-2 cursor-pointer border-r border-term-border text-[8px] tracking-wider uppercase whitespace-nowrap text-term-textDim hover:text-term-text hover:bg-term-panel2"
            }
          >
            <span>{label}</span>
            {tabs.length > 1 && (
              <X
                size={9}
                className="opacity-30 hover:opacity-100 hover:text-term-red"
                onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
