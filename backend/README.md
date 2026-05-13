# Gamma Terminal Backend API

Real-time market data API using yfinance for Gamma Terminal.

## Setup

1. Install Python 3.9+
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The API will start on `http://localhost:8000`

## API Endpoints

### Market Movers
- `GET /api/v1/equity/discovery/gainers` - Top gaining stocks
- `GET /api/v1/equity/discovery/losers` - Top losing stocks  
- `GET /api/v1/equity/discovery/active` - Most active by volume

All endpoints support:
- `limit` parameter (default: 100, max: 500)
- Returns real-time data from Yahoo Finance

## Data Sources

- **Stocks**: S&P 500 top 200 companies
- **Crypto**: Top 50 cryptocurrencies
- **Indices**: 32 global indices
- **Forex**: 16 major currency pairs

All data fetched via yfinance library from Yahoo Finance.

## Performance

- Caches ticker objects for faster repeated requests
- Batch fetches multiple symbols at once
- Returns only requested number of results
- Typical response time: 2-5 seconds for full market scan

## Integration with Frontend

Update `.env` file to point to backend:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Or configure Vite proxy in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```
