import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  ChevronRight,
  Database,
  ShieldCheck,
  RefreshCw
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#090D16] border-l border-pitch-border flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-pitch-border/80 flex items-center justify-between bg-gradient-to-r from-amber-950/30 to-purple-950/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <span>CricketIQ Agentic Intelligence</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Grounded Multi-Agent IPL Reasoning Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-pitch-surface transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="px-5 py-3 border-b border-pitch-border/50 bg-[#0B0F19]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                  className="text-left text-xs px-2.5 py-1 rounded-md bg-pitch-surface/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-pitch-border/60 hover:border-amber-500/40 transition-all flex items-center space-x-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span className="truncate max-w-[200px]">{sq}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Content / Results */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin"></div>
                  <Bot className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Agent Orchestration in Progress...</p>
                  <p className="text-xs text-slate-400 mt-1">Calling database tools, verifying metrics, computing constraints</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm">
                <p className="font-bold">Execution Error</p>
                <p className="text-xs mt-1 text-red-400">{error}</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Agent Activity Trace / Steps */}
                <div className="p-3.5 rounded-xl bg-pitch-card border border-pitch-border">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-pitch-border/60">
                    <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Agent Tool Execution Chain</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                      Intent: {result.intent}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {result.agent_chain.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="font-mono text-[11px] text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Verdict Badge */}
                {result.verdict && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-500/40 shadow-glow-gold">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Scout / Tactical Verdict
                    </p>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {result.verdict}
                    </p>
                  </div>
                )}

                {/* Formatted Markdown Analysis */}
                <div className="p-4 rounded-xl bg-pitch-surface/60 border border-pitch-border/80 prose prose-invert max-w-none text-xs text-slate-200">
                  <div className="whitespace-pre-line leading-relaxed text-sm">
                    {result.response}
                  </div>
                </div>

                {/* Verification Attribution Safeguard */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-pitch-dark border border-pitch-border/40 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Source: {result.data_timestamp}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ground Truth Verified</span>
                  </span>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-bold text-white text-base">Ask Any Cricket Scenario</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
                  Query player comparisons, fantasy XI selections, pitch characteristics, or tournament qualification simulations backed by verified data.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Prompt Input */}
          <div className="p-4 border-t border-pitch-border bg-[#0B0F19]">
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
                className="flex-1 bg-pitch-dark border border-pitch-border focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-black font-bold transition shadow-glow-gold cursor-pointer"
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
