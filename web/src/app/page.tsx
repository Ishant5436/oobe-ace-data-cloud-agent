'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string>('');
  
  // Chat State
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const runAgent = async () => {
    setLoading(true);
    setResult(null);
    setLogs('Initializing Ace Data Cloud Agent with X402 interceptor...\nExecuting workflow in background...\n');
    
    try {
      const res = await fetch('/api/agent', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setResult(data.data);
        setLogs((prev) => prev + '\n' + data.data.rawOutput);
      } else {
        setLogs((prev) => prev + '\nError: ' + data.error);
      }
    } catch (e: any) {
      setLogs((prev) => prev + '\nNetwork Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const askAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query;
    setQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userQ }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQ })
      });
      const data = await res.json();
      
      if (data.success) {
        setChatHistory((prev) => [...prev, { role: 'agent', content: data.data.answer }]);
      } else {
        setChatHistory((prev) => [...prev, { role: 'agent', content: `Error: ${data.error}` }]);
      }
    } catch (err: any) {
      setChatHistory((prev) => [...prev, { role: 'agent', content: `System Error: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center p-8 overflow-hidden pb-32">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

      <header className="z-10 text-center mt-12 mb-16">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          GodMode Autonomous Agent
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Equipped with an Autonomous Background Daemon and a Persistent Vector Memory Bank (RAG).
        </p>
      </header>

      <main className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Action & Results */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold mb-6">Agent Control</h2>
            <button
              onClick={runAgent}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold text-black transition-all ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:scale-105 animate-glow'
              }`}
            >
              {loading ? 'Executing Workflow...' : 'Deploy Single Run'}
            </button>
            <p className="text-xs text-gray-500 mt-4">
              To start autonomous daemon mode, run <code>npm run daemon</code> in terminal.
            </p>
          </div>

          {result && (
            <div className="glass-panel rounded-2xl p-8 flex flex-col gap-6 animate-pulse glow-border">
              <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2 text-emerald-400">Memory Appended!</h2>
              <p className="text-sm text-gray-400">
                The agent has automatically vectorized the following data and saved it to <code>src/data/memory.json</code>.
              </p>
              
              <div>
                <h3 className="text-sm text-emerald-400 font-mono mb-1">Extracted Trend</h3>
                <p className="bg-black/40 p-3 rounded-lg text-gray-300 border border-gray-800 text-sm">
                  {result.trend}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Middle Column: Terminal Logs */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[600px] lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-gray-500 font-mono">agent-terminal ~ zsh</span>
          </div>
          
          <div className="flex-1 bg-black/60 rounded-lg p-4 overflow-y-auto font-mono text-sm text-emerald-400 whitespace-pre-wrap">
            {logs || 'Ready. Waiting for deployment command...'}
            {loading && <span className="animate-pulse">_</span>}
          </div>
        </div>

        {/* Right Column: RAG Interrogation */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[600px] lg:col-span-1">
          <h2 className="text-xl font-semibold border-b border-gray-800 pb-4 mb-4">Interrogate Memory Bank (RAG)</h2>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2">
            {chatHistory.length === 0 && (
              <p className="text-gray-500 text-center mt-10 text-sm italic">
                Ask the agent about the trends it has autonomously researched and stored in its persistent memory.
              </p>
            )}
            
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  {msg.role === 'user' ? 'You' : 'Autonomous Agent'}
                </span>
                <div className={`p-3 rounded-lg text-sm max-w-[90%] ${
                  msg.role === 'user' 
                    ? 'bg-emerald-900/50 border border-emerald-500/30 text-emerald-100' 
                    : 'bg-black/60 border border-gray-700 text-gray-300'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Autonomous Agent</span>
                <div className="p-3 rounded-lg text-sm bg-black/60 border border-gray-700 text-gray-400 animate-pulse">
                  Searching memory vector space...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={askAgent} className="flex gap-2 mt-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the agent's memory..."
              className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-white"
            />
            <button 
              type="submit"
              disabled={chatLoading || !query.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Ask
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
