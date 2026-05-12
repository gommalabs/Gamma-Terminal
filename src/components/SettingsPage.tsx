import { useState, useEffect } from 'react';
import { Save, Trash2, Plus, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface BrokerConfig {
  id: string;
  name: string;
  type: 'ibkr' | 'tradier' | 'alpaca' | 'paper';
  apiKey: string;
  apiSecret?: string;
  account?: string;
  paperTrading: boolean;
  connected: boolean;
  lastSync?: number;
}

export default function SettingsPage() {
  const [brokers, setBrokers] = useState<BrokerConfig[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newBroker, setNewBroker] = useState<Partial<BrokerConfig>>({
    type: 'ibkr',
    paperTrading: true,
  });

  // Load saved broker configs
  useEffect(() => {
    const saved = localStorage.getItem('gamma-terminal-brokers');
    if (saved) {
      try {
        setBrokers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load broker configs:', e);
      }
    }
  }, []);

  // Save broker configs
  const saveBrokers = (configs: BrokerConfig[]) => {
    localStorage.setItem('gamma-terminal-brokers', JSON.stringify(configs));
    setBrokers(configs);
  };

  const handleAddBroker = () => {
    if (!newBroker.name || !newBroker.apiKey) return;

    const broker: BrokerConfig = {
      id: `broker-${Date.now()}`,
      name: newBroker.name,
      type: newBroker.type || 'ibkr',
      apiKey: newBroker.apiKey,
      apiSecret: newBroker.apiSecret,
      account: newBroker.account,
      paperTrading: newBroker.paperTrading ?? true,
      connected: false,
    };

    saveBrokers([...brokers, broker]);
    
    // Simulate connection test
    setTimeout(() => {
      setBrokers(prev => prev.map(b =>
        b.id === broker.id ? { ...b, connected: true, lastSync: Date.now() } : b
      ));
    }, 1500);
    
    setIsAdding(false);
    setNewBroker({ type: 'ibkr', paperTrading: true });
  };

  const removeBroker = (id: string) => {
    saveBrokers(brokers.filter(b => b.id !== id));
  };

  const toggleSecretVisibility = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskSecret = (secret: string) => {
    if (!secret) return '';
    return '•'.repeat(Math.min(secret.length, 16));
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-orange-900/50 bg-gradient-to-r from-orange-950/30 to-black">
        <h1 className="text-2xl font-bold text-amber-400 tracking-wider mb-2">SETTINGS</h1>
        <p className="text-sm text-orange-700">Configure broker connections and trading preferences</p>
      </div>

      <div className="flex-1 p-8 space-y-8">
        {/* Broker Connections Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-amber-400 mb-1">Broker Connections</h2>
              <p className="text-xs text-orange-700">Connect your brokerage accounts for live trading</p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-950 border border-orange-800 text-amber-400 hover:bg-orange-900 hover:border-amber-500 transition-colors text-sm uppercase tracking-wider"
            >
              <Plus size={14} />
              Add Broker
            </button>
          </div>

          {/* Broker List */}
          <div className="space-y-4">
            {brokers.length === 0 ? (
              <div className="p-12 border border-orange-900/50 rounded-lg bg-black/50 text-center">
                <div className="text-orange-700 mb-4">No brokers configured</div>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-2 bg-orange-950 border border-orange-800 text-amber-400 hover:bg-orange-900 transition-colors text-sm uppercase"
                >
                  Connect Your First Broker
                </button>
              </div>
            ) : (
              brokers.map(broker => (
                <div
                  key={broker.id}
                  className="p-6 border border-orange-900/50 rounded-lg bg-black/50 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${broker.connected ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-orange-700'}`} />
                      <div>
                        <h3 className="text-amber-400 font-semibold">{broker.name}</h3>
                        <p className="text-xs text-orange-700 uppercase tracking-wider">{broker.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {broker.connected ? (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle size={12} />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-orange-700">
                          <XCircle size={12} />
                          Not Connected
                        </span>
                      )}
                      <button
                        onClick={() => removeBroker(broker.id)}
                        className="p-2 hover:bg-red-950/50 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-xs text-orange-700 uppercase tracking-wider block mb-1">API Key</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-orange-950/30 border border-orange-900/50 rounded text-amber-400 font-mono text-xs">
                          {showSecrets[broker.id] ? broker.apiKey : maskSecret(broker.apiKey)}
                        </code>
                        <button
                          onClick={() => toggleSecretVisibility(broker.id)}
                          className="p-2 hover:bg-orange-950 rounded transition-colors"
                        >
                          {showSecrets[broker.id] ? <EyeOff size={14} className="text-orange-600" /> : <Eye size={14} className="text-orange-600" />}
                        </button>
                      </div>
                    </div>

                    {broker.apiSecret && (
                      <div>
                        <label className="text-xs text-orange-700 uppercase tracking-wider block mb-1">API Secret</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-orange-950/30 border border-orange-900/50 rounded text-amber-400 font-mono text-xs">
                            {showSecrets[broker.id] ? broker.apiSecret : maskSecret(broker.apiSecret)}
                          </code>
                          <button
                            onClick={() => toggleSecretVisibility(broker.id)}
                            className="p-2 hover:bg-orange-950 rounded transition-colors"
                          >
                            {showSecrets[broker.id] ? <EyeOff size={14} className="text-orange-600" /> : <Eye size={14} className="text-orange-600" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {broker.account && (
                      <div>
                        <label className="text-xs text-orange-700 uppercase tracking-wider block mb-1">Account</label>
                        <div className="px-3 py-2 bg-orange-950/30 border border-orange-900/50 rounded text-amber-400 font-mono text-xs">
                          {broker.account}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-orange-700 uppercase tracking-wider block mb-1">Mode</label>
                      <div className={`px-3 py-2 rounded border text-xs font-medium ${
                        broker.paperTrading
                          ? 'bg-green-950/30 border-green-800 text-green-400'
                          : 'bg-orange-950/30 border-orange-800 text-orange-400'
                      }`}>
                        {broker.paperTrading ? 'PAPER TRADING' : 'LIVE TRADING'}
                      </div>
                    </div>
                  </div>

                  {broker.lastSync && (
                    <div className="mt-4 pt-4 border-t border-orange-900/30 text-xs text-orange-700">
                      Last synced: {new Date(broker.lastSync).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add Broker Form Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-black border border-orange-800 rounded-lg shadow-2xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-6">Add Broker Connection</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-orange-700 uppercase tracking-wider block mb-2">Broker Name</label>
                  <input
                    type="text"
                    value={newBroker.name || ''}
                    onChange={e => setNewBroker({ ...newBroker, name: e.target.value })}
                    placeholder="My IBKR Account"
                    className="w-full px-4 py-2 bg-orange-950/30 border border-orange-800 text-amber-400 placeholder-orange-800 focus:border-amber-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-orange-700 uppercase tracking-wider block mb-2">Broker Type</label>
                  <select
                    value={newBroker.type}
                    onChange={e => setNewBroker({ ...newBroker, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-orange-950/30 border border-orange-800 text-amber-400 focus:border-amber-500 focus:outline-none text-sm font-mono"
                  >
                    <option value="ibkr">Interactive Brokers (IBKR)</option>
                    <option value="tradier">Tradier</option>
                    <option value="alpaca">Alpaca</option>
                    <option value="paper">Paper Trading</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-orange-700 uppercase tracking-wider block mb-2">API Key</label>
                  <input
                    type="text"
                    value={newBroker.apiKey || ''}
                    onChange={e => setNewBroker({ ...newBroker, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2 bg-orange-950/30 border border-orange-800 text-amber-400 placeholder-orange-800 focus:border-amber-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-orange-700 uppercase tracking-wider block mb-2">API Secret (Optional)</label>
                  <input
                    type="password"
                    value={newBroker.apiSecret || ''}
                    onChange={e => setNewBroker({ ...newBroker, apiSecret: e.target.value })}
                    placeholder="Enter your API secret"
                    className="w-full px-4 py-2 bg-orange-950/30 border border-orange-800 text-amber-400 placeholder-orange-800 focus:border-amber-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-orange-700 uppercase tracking-wider block mb-2">Account ID (Optional)</label>
                  <input
                    type="text"
                    value={newBroker.account || ''}
                    onChange={e => setNewBroker({ ...newBroker, account: e.target.value })}
                    placeholder="Account number"
                    className="w-full px-4 py-2 bg-orange-950/30 border border-orange-800 text-amber-400 placeholder-orange-800 focus:border-amber-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBroker.paperTrading}
                      onChange={e => setNewBroker({ ...newBroker, paperTrading: e.target.checked })}
                      className="w-4 h-4 bg-orange-950 border-orange-800 text-amber-400 focus:ring-amber-500"
                    />
                    <span className="text-sm text-amber-400">Paper Trading Mode</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddBroker}
                  disabled={!newBroker.name || !newBroker.apiKey}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-950 border border-orange-800 text-amber-400 hover:bg-orange-900 hover:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase"
                >
                  <Save size={14} />
                  Save Connection
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 border border-orange-800 text-orange-600 hover:bg-orange-950 transition-colors text-sm uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Info */}
        <section className="pt-8 border-t border-orange-900/50">
          <h2 className="text-lg font-semibold text-amber-400 mb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-black/50 border border-orange-900/50 rounded">
              <div className="flex items-center gap-3 mb-2">
                <kbd className="px-3 py-1 bg-orange-950 border border-orange-800 rounded text-amber-400 font-mono text-xs">:</kbd>
                <span className="text-orange-600">Open command palette</span>
              </div>
            </div>
            <div className="p-4 bg-black/50 border border-orange-900/50 rounded">
              <div className="flex items-center gap-3 mb-2">
                <kbd className="px-3 py-1 bg-orange-950 border border-orange-800 rounded text-amber-400 font-mono text-xs">Ctrl+←</kbd>
                <kbd className="px-3 py-1 bg-orange-950 border border-orange-800 rounded text-amber-400 font-mono text-xs">Ctrl+→</kbd>
                <span className="text-orange-600">Switch between tabs</span>
              </div>
            </div>
            <div className="p-4 bg-black/50 border border-orange-900/50 rounded">
              <div className="flex items-center gap-3 mb-2">
                <kbd className="px-3 py-1 bg-orange-950 border border-orange-800 rounded text-amber-400 font-mono text-xs">ESC</kbd>
                <span className="text-orange-600">Close command palette</span>
              </div>
            </div>
            <div className="p-4 bg-black/50 border border-orange-900/50 rounded">
              <div className="flex items-center gap-3 mb-2">
                <kbd className="px-3 py-1 bg-orange-950 border border-orange-800 rounded text-amber-400 font-mono text-xs">↑↓</kbd>
                <span className="text-orange-600">Navigate suggestions</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
