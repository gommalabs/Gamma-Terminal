import { useEffect } from "react";
import { WorkspaceTabs } from "@/components/WorkspaceTabs";
import { StatusBar } from "@/components/StatusBar";
import { FunctionPanel } from "@/components/FunctionPanel";
import { useWorkspace } from "@/store/workspaceStore";
import HomePage from "@/components/HomePage";
import CommandPalette from "@/components/CommandPalette";
import SettingsPage from "@/components/SettingsPage";
import NewsPage from "@/components/NewsPage";
import { SCORECARD } from "@/functions/SCORECARD";
import { CC } from "@/functions/CC";
import DES from "@/functions/DES";
import { MOV } from "@/functions/MOV";
import { WEI } from "@/functions/WEI";
import { OMON } from "@/functions/OMON";
import { CURV } from "@/functions/CURV";
import { CRYPTO } from "@/functions/CRYPTO";
import { HP } from "@/functions/HP";
import { FA } from "@/functions/FA";
import { KEY } from "@/functions/KEY";
import { DVD } from "@/functions/DVD";
import { EE } from "@/functions/EE";
import { FXC } from "@/functions/FXC";
import { HELP } from "@/functions/HELP";
import { QR } from "@/functions/QR";
import { GP } from "@/functions/GP";
import { SECTOR_HEATMAP } from "@/functions/SECTOR_HEATMAP";
import { NI } from "@/functions/NI";
import { RV } from "@/functions/RV";
import { ECO } from "@/functions/ECO";
import { PORT } from "@/functions/PORT";
import { PREDICTION } from "@/functions/PREDICTION";

function ActiveView() {
  const { tabs, activeTabId } = useWorkspace();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!activeTab) return <HomePage />;

  // CC (Command Center) shows the HomePage dashboard
  if (activeTab.code === "CC") {
    return <CC />;
  }

  // SETTINGS shows the Settings page
  if (activeTab.code === "SETTINGS") {
    return <SettingsPage />;
  }

  // NEWS shows the dedicated News page
  if (activeTab.code === "NEWS") {
    return <NewsPage />;
  }

  // Render function-specific components
  const symbol = activeTab.symbol;

  switch (activeTab.code) {
    case "SCORECARD":
      return symbol ? <SCORECARD symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "DES":
      return symbol ? <DES security={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "GP":
      return symbol ? <GP symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "HP":
      return symbol ? <HP symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "FA":
      return symbol ? <FA symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "KEY":
      return symbol ? <KEY symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "DVD":
      return symbol ? <DVD symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "EE":
      return symbol ? <EE symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "NI":
      return symbol ? <NI symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "QR":
      return symbol ? <QR symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "RV":
      return symbol ? <RV symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "OMON":
      return symbol ? <OMON symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "MOV":
      return <MOV />;
    case "WEI":
      return <WEI />;
    case "CURV":
      return <CURV />;
    case "CRYPTO":
      return <CRYPTO />;
    case "FXC":
      return <FXC />;
    case "SECTOR_HEATMAP":
      return symbol ? <SECTOR_HEATMAP symbol={symbol} /> : <div className="p-6 text-term-muted">No symbol selected</div>;
    case "ECO":
      return <ECO />;
    case "PORT":
      return <PORT />;
    case "PREDICTION":
      return <PREDICTION />;
    case "HELP":
      return <HELP />;
    default:
      return (
        <FunctionPanel code={activeTab.code} symbol={activeTab.symbol}>
          <div className="p-6">
            <div className="text-term-muted text-sm">
              View for {activeTab.code}
              {activeTab.symbol && <span> - {activeTab.symbol}</span>}
            </div>
          </div>
        </FunctionPanel>
      );
  }
}

export default function TerminalApp() {
  const { tabs, activeTabId, setActiveTab } = useWorkspace();

  // Keyboard shortcuts for tab switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Arrow keys to switch tabs
      if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        
        if (tabs.length <= 1) return;
        
        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        let nextIndex: number;
        
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        setActiveTab(tabs[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId, setActiveTab]);

  return (
    <div className="h-screen flex flex-col bg-term-black text-term-text font-mono overflow-hidden">
      {/* Top branding bar - ultra compact */}
      <div className="flex items-center justify-between h-5 px-2 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-2">
          <span className="text-term-amber font-bold tracking-[0.15em] text-[9px] uppercase">
            GAMMA TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-3 text-[7px] uppercase tracking-wider text-term-textDim">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-term-green animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
      
      {/* Workspace tabs - minimal */}
      <WorkspaceTabs />
      
      {/* Main content area */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ActiveView />
        <CommandPalette />
      </div>
      
      {/* Status bar - dense */}
      <StatusBar />
    </div>
  );
}
