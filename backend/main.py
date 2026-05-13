from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from typing import Optional, List
from datetime import datetime, timedelta
import json

app = FastAPI(title="Gamma Terminal API", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Helper Functions ───

def get_top_stocks(limit: int = 100):
    """Get a list of popular stock symbols"""
    # S&P 500 components (top 100 by market cap)
    return [
        "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "UNH", "JNJ",
        "XOM", "V", "JPM", "WMT", "PG", "MA", "HD", "CVX", "MRK", "ABBV",
        "KO", "PEP", "COST", "AVGO", "LLY", "ADBE", "MCD", "CSCO", "CRM", "ACN",
        "NFLX", "AMD", "INTC", "CMCSA", "VZ", "TMO", "ABT", "NKE", "DHR", "TXN",
        "NEE", "BMY", "QCOM", "PM", "RTX", "UNP", "ORCL", "HON", "LOW", "IBM",
        "AMGN", "SPGI", "INTU", "CAT", "GS", "BA", "BLK", "AXP", "DE", "ISRG",
        "SYK", "MDT", "BKNG", "GILD", "ADI", "TJX", "VRTX", "MU", "REGN", "PLD",
        "CI", "SCHW", "MO", "CB", "SO", "DUK", "ZTS", "BDX", "EOG", "USB",
        "PNC", "AON", "CL", "ITW", "APD", "CSX", "MMC", "ICE", "NSC", "GD",
        "SHW", "EQIX", "FCX", "EMR", "FIS", "PSA", "WM", "ATVI", "KLAC", "SNPS",
        "CDNS", "MCHP", "ADSK", "NXPI", "IDXX", "CTAS", "FAST", "PAYX", "ROST",
        "EA", "BIIB", "EXC", "XEL", "WBA", "DLTR", "ALGN", "VRSK", "CTSH", "ANSS"
    ][:limit]

def get_top_crypto(limit: int = 50):
    """Get top cryptocurrency symbols"""
    return [
        "BTC-USD", "ETH-USD", "USDT-USD", "BNB-USD", "SOL-USD",
        "XRP-USD", "USDC-USD", "ADA-USD", "AVAX-USD", "DOGE-USD",
        "TRX-USD", "DOT-USD", "LINK-USD", "MATIC-USD", "TON-USD",
        "SHIB-USD", "DAI-USD", "LTC-USD", "BCH-USD", "UNI-USD",
        "ATOM-USD", "ETC-USD", "FIL-USD", "APT-USD", "NEAR-USD",
        "VET-USD", "ALGO-USD", "ICP-USD", "HBAR-USD", "ARB-USD",
        "OP-USD", "AAVE-USD", "GRT-USD", "SAND-USD", "MANA-USD",
        "THETA-USD", "FTM-USD", "FLOW-USD", "XTZ-USD", "EGLD-USD",
        "AXS-USD", "CHZ-USD", "ENJ-USD", "ZIL-USD", "BAT-USD",
        "COMP-USD", "MKR-USD", "SNX-USD", "CRV-USD", "YFI-USD"
    ][:limit]

def get_major_indices():
    """Get major index symbols"""
    return [
        "^GSPC", "^DJI", "^IXIC", "^RUT", "^VIX",
        "^GSPTSE", "^BVSP", "^MXX", "^MERV",
        "^FTSE", "^GDAXI", "^FCHI", "^STOXX50E", "^IBEX", "^FTMIB", "^AEX", "^SSMI", "^OMXC25", "^OSEAX",
        "^N225", "^HSI", "^AXJO", "^KS11", "^TWII", "^SSEC", "^SZSC", "^NSEI", "^BSESN", "^JKSE", "^KLSE", "^SET", "^NZ50"
    ]

def get_major_fx():
    """Get major forex pairs"""
    return [
        "EURUSD=X", "GBPUSD=X", "USDJPY=X", "USDCHF=X",
        "USDCAD=X", "AUDUSD=X", "NZDUSD=X", "EURGBP=X",
        "EURJPY=X", "GBPJPY=X", "USDCNY=X", "USDMXN=X",
        "USDINR=X", "USDBRL=X", "USDRUB=X", "USDZAR=X"
    ]

# ─── API Endpoints ───

@app.get("/api/v1/equity/discovery/gainers")
async def get_gainers(provider: str = "yfinance", limit: int = 100):
    """Get top gaining stocks"""
    try:
        symbols = get_top_stocks(200)
        tickers = yf.Tickers(" ".join(symbols))
        
        gainers = []
        for symbol in symbols:
            try:
                hist = tickers.tickers[symbol].history(period="2d")
                if len(hist) < 2:
                    continue
                
                today = hist.iloc[-1]
                yesterday = hist.iloc[-2]
                
                change_pct = ((today['Close'] - yesterday['Close']) / yesterday['Close']) * 100
                
                if change_pct > 0:
                    info = tickers.tickers[symbol].info
                    gainers.append({
                        "symbol": symbol,
                        "name": info.get('longName', symbol),
                        "price": float(today['Close']),
                        "change": float(today['Close'] - yesterday['Close']),
                        "percent_change": float(change_pct / 100),
                        "volume": int(today['Volume']),
                        "market_cap": info.get('marketCap', 0),
                        "pe_forward": info.get('forwardPE', None)
                    })
            except:
                continue
        
        # Sort by percent change descending and return top N
        gainers.sort(key=lambda x: x['percent_change'], reverse=True)
        return {"results": gainers[:limit]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/equity/discovery/losers")
async def get_losers(provider: str = "yfinance", limit: int = 100):
    """Get top losing stocks"""
    try:
        symbols = get_top_stocks(200)
        tickers = yf.Tickers(" ".join(symbols))
        
        losers = []
        for symbol in symbols:
            try:
                hist = tickers.tickers[symbol].history(period="2d")
                if len(hist) < 2:
                    continue
                
                today = hist.iloc[-1]
                yesterday = hist.iloc[-2]
                
                change_pct = ((today['Close'] - yesterday['Close']) / yesterday['Close']) * 100
                
                if change_pct < 0:
                    info = tickers.tickers[symbol].info
                    losers.append({
                        "symbol": symbol,
                        "name": info.get('longName', symbol),
                        "price": float(today['Close']),
                        "change": float(today['Close'] - yesterday['Close']),
                        "percent_change": float(change_pct / 100),
                        "volume": int(today['Volume']),
                        "market_cap": info.get('marketCap', 0),
                        "pe_forward": info.get('forwardPE', None)
                    })
            except:
                continue
        
        # Sort by percent change ascending and return top N
        losers.sort(key=lambda x: x['percent_change'])
        return {"results": losers[:limit]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/equity/discovery/active")
async def get_most_active(provider: str = "yfinance", limit: int = 100):
    """Get most active stocks by volume"""
    try:
        symbols = get_top_stocks(200)
        tickers = yf.Tickers(" ".join(symbols))
        
        active = []
        for symbol in symbols:
            try:
                hist = tickers.tickers[symbol].history(period="1d")
                if len(hist) < 1:
                    continue
                
                today = hist.iloc[-1]
                info = tickers.tickers[symbol].info
                
                active.append({
                    "symbol": symbol,
                    "name": info.get('longName', symbol),
                    "price": float(today['Close']),
                    "change": 0,
                    "percent_change": 0,
                    "volume": int(today['Volume']),
                    "market_cap": info.get('marketCap', 0),
                    "pe_forward": info.get('forwardPE', None)
                })
            except:
                continue
        
        # Sort by volume descending and return top N
        active.sort(key=lambda x: x['volume'], reverse=True)
        return {"results": active[:limit]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Gamma Terminal API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
