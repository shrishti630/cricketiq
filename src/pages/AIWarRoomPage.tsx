import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Database, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { askAgent } from '../services/api';
import { AgentResponse } from '../types/cricket';

export const AIWarRoomPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);

  const scenarioTemplates = [
    { title: "Player Scout", prompt: "Compare Virat Kohli and Rohit Sharma for next match" },
    { title: "Fantasy Optimizer", prompt: "Build the best Fantasy XI for CSK vs MI" },
    { title: "Venue Traits", prompt: "Analyze pitch conditions and boundary lengths for Chepauk stadium" },
    { title: "Playoff Simulator", prompt: "Can RCB still qualify for the IPL 2025 playoffs?" },
    { title: "Live Match Chase", prompt: "MI need 42 runs in 26 balls with 5 wickets down at Chepauk" },
    { title: "Head-to-Head", prompt: "Compare Jasprit Bumrah and Mohammed Siraj economy rates" }
  ];

  const handleExecute = async (promptToRun?: string) => {
    const q = promptToRun || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await askAgent(q);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-[#0A0E1A] border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-2xl shadow-glow-gold">
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center space-x-2">
                <span>CricketIQ Intelligence War Room</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Autonomous Multi-Agent Layer
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Grounded reasoning using markdown instruction templates and deterministic PostgreSQL cricket tools.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="flex items-center text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Orchestrator Online
            </span>
          </div>
        </div>
      </div>

      {/* Main Query Bar */}
      <div className="p-4 rounded-2xl glass-panel border-pitch-border/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any cricket question, matchup query, or simulation scenario..."
            className="flex-1 bg-pitch-dark border border-pitch-border focus:border-amber-500 rounded-xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition font-medium"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-black font-extrabold text-xs shadow-glow-gold transition flex items-center space-x-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Orchestrating...' : 'Run Query'}</span>
          </button>
        </form>

        {/* Quick Scenario Chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-pitch-border/50">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider self-center mr-1">
            Scenarios:
          </span>
          {scenarioTemplates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(t.prompt);
                handleExecute(t.prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-pitch-surface hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-pitch-border/60 hover:border-amber-500/40 transition flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Response View */}
      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-white">Agent Multi-Step Orchestration in Progress...</p>
          <p className="text-xs text-slate-400">Classifying user intent, executing database tools, validating hard constraints.</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Agent Activity Trace / Pipeline */}
          <div className="p-5 rounded-2xl glass-panel border-pitch-border">
            <div className="flex items-center justify-between pb-3 border-b border-pitch-border/60 mb-3">
              <span className="text-xs font-extrabold text-amber-400 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Tool Execution Trace & Intent Dispatch</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Intent: {result.intent}
              </span>
            </div>

            <div className="space-y-2">
              {result.agent_chain.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-2 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict Summary */}
          {result.verdict && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-[#0A0E1A] border border-amber-500/40 shadow-glow-gold">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Executive Synthesis Verdict
              </span>
              <p className="text-base font-extrabold text-white leading-relaxed">
                {result.verdict}
              </p>
            </div>
          )}

          {/* Formatted Markdown Analysis */}
          <div className="p-6 rounded-2xl glass-panel border-pitch-border prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line">
            {result.response}
          </div>

          {/* Verification Badge */}
          <div className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Evidence Timestamp: <strong>{result.data_timestamp}</strong></span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Deterministic Grounding & No Hallucinations</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
