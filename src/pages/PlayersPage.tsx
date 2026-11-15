import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  Sparkles, 
  Check, 
  Award,
  Zap,
  TrendingUp,
  Shield,
  Bot
} from 'lucide-react';
import { fetchPlayers, comparePlayers } from '../services/api';
import { Player } from '../types/cricket';

interface PlayersPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({ onOpenAIWithQuery }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState('ALL');

  // Comparator states
  const [compareP1, setCompareP1] = useState<string>('Virat Kohli');
  const [compareP2, setCompareP2] = useState<string>('Rohit Sharma');
  const [compResult, setCompResult] = useState<any>(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchPlayers().then(setPlayers);
  }, []);

  const handleRunComparison = async () => {
    if (!compareP1 || !compareP2) return;
    setComparing(true);
    try {
      const res = await comparePlayers(compareP1, compareP2);
      setCompResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || p.role.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesTeam = selectedTeam === 'ALL' || p.team_id === selectedTeam;
    return matchesSearch && matchesRole && matchesTeam;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-pitch-border/60">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span>IPL Player Scout & Head-to-Head</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Verified Data
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare players on career records, recent form, strike rates, bowling economies, and fantasy averages.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search star players..."
            className="w-full bg-pitch-surface border border-pitch-border focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Head-to-Head Comparator Section */}
      <section className="p-6 rounded-2xl glass-panel border-amber-500/40 bg-gradient-to-r from-[#0C1222] via-[#10182C] to-[#0A0E1A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pitch-border/50">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white">Interactive Player Comparator</h2>
          </div>
          <button
            onClick={() => onOpenAIWithQuery(`Compare ${compareP1} and ${compareP2} for next match in deep detail`)}
            className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch Deep AI Comparison</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 items-center">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Player 1
            </label>
            <select
              value={compareP1}
              onChange={(e) => setCompareP1(e.target.value)}
              className="w-full bg-pitch-surface border border-pitch-border focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
            >
              {players.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.team_id}) - {p.role}</option>
              ))}
            </select>
          </div>

          <div className="text-center pt-2 md:pt-4">
            <button
              onClick={handleRunComparison}
              disabled={comparing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs shadow-glow-gold transition"
            >
              {comparing ? 'Analyzing Metrics...' : 'Compare Head-to-Head'}
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Player 2
            </label>
            <select
              value={compareP2}
              onChange={(e) => setCompareP2(e.target.value)}
              className="w-full bg-pitch-surface border border-pitch-border focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white"
            >
              {players.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.team_id}) - {p.role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Output Grid */}
        {compResult && !compResult.error && (
          <div className="mt-6 pt-5 border-t border-pitch-border/60">
            <div className="text-center mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                ⭐ Statistical Edge: {compResult.statistical_edge}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-pitch-surface/60 border border-pitch-border/70">
                <span className="text-slate-400 text-[11px] block">Batting Strike Rate Delta</span>
                <span className="text-sm font-black text-amber-400 font-mono mt-0.5 block">
                  {compResult.deltas.strike_rate_delta > 0 ? `+${compResult.deltas.strike_rate_delta}` : compResult.deltas.strike_rate_delta}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-surface/60 border border-pitch-border/70">
                <span className="text-slate-400 text-[11px] block">Batting Average Delta</span>
                <span className="text-sm font-black text-cyan-400 font-mono mt-0.5 block">
                  {compResult.deltas.average_delta > 0 ? `+${compResult.deltas.average_delta}` : compResult.deltas.average_delta}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-surface/60 border border-pitch-border/70">
                <span className="text-slate-400 text-[11px] block">Wickets Delta</span>
                <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
                  {compResult.deltas.wickets_delta > 0 ? `+${compResult.deltas.wickets_delta}` : compResult.deltas.wickets_delta}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-pitch-surface/60 border border-pitch-border/70">
                <span className="text-slate-400 text-[11px] block">Bowling Economy Delta</span>
                <span className="text-sm font-black text-purple-400 font-mono mt-0.5 block">
                  {compResult.deltas.economy_delta}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Role Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedRole === role
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-pitch-surface text-slate-300 hover:text-white border border-pitch-border'
            }`}
          >
            {role === 'ALL' ? 'All Roles' : role}
          </button>
        ))}
      </div>

      {/* Players Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlayers.map((p) => {
          const s = p.stats;
          return (
            <div key={p.id} className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-pitch-surface text-amber-400 border border-pitch-border mb-1.5">
                      {p.team_id} • {p.role}
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {p.name} {p.is_captain && '⭐ (C)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">{p.batting_style}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                      {p.credits} Cr
                    </span>
                    <span className="block text-[10px] text-emerald-400 mt-1 font-medium">
                      Form: {p.recent_form}
                    </span>
                  </div>
                </div>

                {/* Stat Pill Grid */}
                {s && (
                  <div className="grid grid-cols-3 gap-2 my-4 text-center text-xs">
                    <div className="p-2 rounded-lg bg-pitch-surface/60 border border-pitch-border/50">
                      <span className="text-[10px] text-slate-400 block">Runs</span>
                      <strong className="text-white font-mono">{s.runs}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-pitch-surface/60 border border-pitch-border/50">
                      <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                      <strong className="text-amber-400 font-mono">{s.strike_rate}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-pitch-surface/60 border border-pitch-border/50">
                      <span className="text-[10px] text-slate-400 block">Avg / Wkts</span>
                      <strong className="text-cyan-400 font-mono">
                        {s.wickets > 5 ? `${s.wickets} W` : s.average}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-pitch-border/50 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setCompareP1(p.name);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Set as P1</span>
                </button>

                <button
                  onClick={() => onOpenAIWithQuery(`Scout and match analysis for ${p.name}`)}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Scout</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
