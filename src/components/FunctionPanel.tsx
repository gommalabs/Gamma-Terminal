import { type ReactNode } from "react";
import { FN_BY_CODE, type FunctionCode } from "@/lib/functions";

interface Props {
  code: FunctionCode;
  symbol?: string;
  children: ReactNode;
}

export function FunctionPanel({ code, symbol, children }: Props) {
  const fn = FN_BY_CODE[code];
  return (
    <div className="panel flex-1 min-h-0 min-w-0">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-term-amber font-bold text-[9px]">{code}</span>
          <span className="text-term-muted">|</span>
          <span className="text-term-text text-[9px] uppercase">{fn.name}</span>
          {symbol && (
            <>
              <span className="text-term-muted">|</span>
              <span className="text-term-amberBright num text-[9px]">{symbol}</span>
            </>
          )}
        </div>
        <div className="text-term-textDim normal-case tracking-normal font-normal text-[7px] uppercase">
          {fn.summary}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bb-scroll">{children}</div>
    </div>
  );
}
