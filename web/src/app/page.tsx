'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string>('');

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

  return (
    <div className="min-h-screen relative flex flex-col items-center p-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

      <header className="z-10 text-center mt-12 mb-16">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          OOBE x Ace Data Cloud
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Autonomous Agent Dashboard. Bridging on-chain identity via SAP with multi-modal AI generation via the X402 payment interceptor.
        </p>
      </header>

      <main className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Action & Results */}
        <div className="flex flex-col gap-6">
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
              {loading ? 'Executing Workflow...' : 'Deploy Autonomous Workflow'}
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Costs ~0.0001 SOL per API call using X402 interceptor.
            </p>
          </div>

          {result && (
            <div className="glass-panel rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold border-b border-gray-800 pb-2">Extracted Data</h2>
              
              <div>
                <h3 className="text-sm text-emerald-400 font-mono mb-1">Step 1: Trend (Google Search)</h3>
                <p className="bg-black/40 p-4 rounded-lg text-gray-200 border border-gray-800">
                  {result.trend}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-cyan-400 font-mono mb-1">Step 2: Script (GPT-4o)</h3>
                <p className="bg-black/40 p-4 rounded-lg text-gray-200 border border-gray-800">
                  {result.script}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-blue-400 font-mono mb-1">Step 3: Vectorization (Embeddings)</h3>
                <p className="bg-black/40 p-4 rounded-lg text-gray-200 border border-gray-800">
                  {result.vectorized ? '✅ Successfully converted to 1536-dimensional vector.' : '❌ Failed'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Terminal Logs */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
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

      </main>
    </div>
  );
}
