import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Database,
  ShieldCheck
} from 'lucide-react';
import { askAgent } from '../../services/api';
import { AgentResponse } from '../../types/cricket';

interface AIAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AIAnalystDrawer: React.FC<AIAnalystDrawerProps> = ({ isOpen, onClose, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    "Compare Virat Kohli and Rohit Sharma",
    "Build the best Fantasy XI for CSK vs MI",
    "Analyze pitch and boundary dimensions for Chepauk",
    "What are RCB's chances of making the playoffs?",
    "Calculate win probability: MI need 42 off 26 balls with 5 wickets down"
  ];

  const handleSearch = async (textToRun?: string) => {
    const q = textToRun || query;
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await askAgent(q);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to execute agent workflow');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-slate-200 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <span>CricketIQ Agentic Intelligence</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Grounded Multi-Agent IPL Reasoning Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant Strategic Insights
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sq);
                    handleSearch(sq);
                  }}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700 border border-slate-200 hover:border-amber-300 transition-all flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[210px]">{sq}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Content / Results */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-300 border-t-amber-500 animate-spin"></div>
                  <Bot className="w-6 h-6 text-amber-500 absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">Agent Orchestration in Progress...</p>
                  <p className="text-xs text-slate-500 mt-1">Executing specialist tools, verifying metrics, computing constraints</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <p className="font-bold">Execution Error</p>
                <p className="text-xs mt-1 text-red-600">{error}</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Agent Activity Trace / Steps */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-amber-700 flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Tool Execution Trace</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Intent: {result.intent}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {result.agent_chain.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-mono text-[11px] text-slate-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Verdict Badge */}
                {result.verdict && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                      Scout / Tactical Verdict
                    </p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      {result.verdict}
                    </p>
                  </div>
                )}

                {/* Formatted Markdown Analysis */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-800">
                  <div className="whitespace-pre-line leading-relaxed text-sm">
                    {result.response}
                  </div>
                </div>

                {/* Verification Attribution Safeguard */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Source: {result.data_timestamp}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ground Truth Verified</span>
                  </span>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Ask Any Cricket Scenario</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                  Query player comparisons, fantasy XI selections, pitch characteristics, or tournament qualification simulations backed by verified data.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Prompt Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about players, matches, venues, fantasy, or scenarios..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-black font-bold transition shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
