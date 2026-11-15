import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Flame, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight,
  Shield, 
  Calendar, 
  Clock, 
  MapPin,
  Bot
} from 'lucide-react';
import { fetchMatches, fetchStandings, fetchPlayers } from '../services/api';
import { Match, StandingRow, Player } from '../types/cricket';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenAIWithQuery: (q: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenAIWithQuery }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, s, p] = await Promise.all([
          fetchMatches(),
          fetchStandings(),
          fetchPlayers()
        ]);
        setMatches(m);
        setStandings(s);
        setPlayers(p);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const liveMatch = matches.find(m => m.status === 'LIVE') || matches[0];
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Live Match Center Banner */}
      {liveMatch && (
        <section className="relative overflow-hidden rounded-2xl glass-panel border-amber-500/30 p-6 md:p-8 bg-gradient-to-r from-[#0C1222] via-[#111A30] to-[#0A0E1A] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-pitch-border/60">
            <div className="flex items-center space-x-3">
              <span className="flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-2"></span>
                Match #{liveMatch.match_number} • {liveMatch.status}
              </span>
              <span className="text-xs text-slate-400 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {liveMatch.venue.name}, {liveMatch.venue.city}
              </span>
            </div>

            <button
              onClick={() => onOpenAIWithQuery(`Analyze tactical state for ${liveMatch.home_team.name} vs ${liveMatch.away_team.name}`)}
              className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-lg transition"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Match Intelligence</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teams Scoreboard Battle */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Home Team */}
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0"
                style={{ backgroundColor: liveMatch.home_team.color }}
              >
                {liveMatch.home_team.short_name}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">{liveMatch.home_team.name}</h3>
                <p className="text-2xl font-black text-amber-400 mt-0.5">{liveMatch.home_score || '189/4 (20.0)'}</p>
                <span className="text-xs text-slate-400 font-medium">1st Innings Target: 190</span>
              </div>
            </div>

            {/* VS & Live State Headline */}
            <div className="text-center px-4">
              <span className="text-xs font-black px-3 py-1 rounded-md bg-pitch-surface text-slate-400 border border-pitch-border">
                VS
              </span>
              <p className="text-xs font-medium text-emerald-400 mt-3 leading-relaxed">
                {liveMatch.live_headline || 'Match in decisive phase'}
              </p>
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-4 md:justify-end text-left md:text-right">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-extrabold text-white">{liveMatch.away_team.name}</h3>
                <p className="text-2xl font-black text-cyan-400 mt-0.5">{liveMatch.away_score || '148/5 (15.4)'}</p>
                <span className="text-xs text-slate-400 font-medium">Req RR: 9.69</span>
              </div>
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0 order-1 md:order-2"
                style={{ backgroundColor: liveMatch.away_team.color }}
              >
                {liveMatch.away_team.short_name}
              </div>
            </div>
          </div>

          {/* Win Probability Bar */}
          <div className="pt-4 border-t border-pitch-border/50">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-400">
                {liveMatch.home_team.short_name} {liveMatch.win_probability_home}% Win Probability
              </span>
              <span className="text-cyan-400">
                {liveMatch.away_team.short_name} {Math.round(100 - liveMatch.win_probability_home)}% Win Probability
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-pitch-dark overflow-hidden flex border border-pitch-border/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${liveMatch.win_probability_home}%` }}
              ></div>
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                style={{ width: `${100 - liveMatch.win_probability_home}%` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Upcoming Matches + Standings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Fixtures & Player Spotlight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white tracking-wide">High-Stakes IPL Fixtures</h2>
            </div>
            <button 
              onClick={() => onNavigate('standings')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View Full Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.slice(1, 5).map((m) => (
              <div key={m.id} className="p-5 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-pitch-border/50">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                      {m.date}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-pitch-surface text-[10px] font-bold">
                      {m.time}
                    </span>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: m.home_team.color }}
                        ></span>
                        <span className="font-bold text-sm text-white">{m.home_team.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{m.home_score || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: m.away_team.color }}
                        ></span>
                        <span className="font-bold text-sm text-white">{m.away_team.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{m.away_score || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-pitch-border/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[150px]">{m.venue.city}</span>
                  <button
                    onClick={() => onOpenAIWithQuery(`Tactical preview for ${m.home_team.short_name} vs ${m.away_team.short_name}`)}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Scout Match</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fast Strategic AI Prompts Chips */}
          <div className="p-5 rounded-2xl glass-panel bg-gradient-to-r from-amber-950/20 to-purple-950/20 border border-amber-500/20">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Ask CricketIQ Agent</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { title: "Player Battle", query: "Compare Virat Kohli and Rohit Sharma career strike rates" },
                { title: "Dream11 XI", query: "Build the best Fantasy XI for CSK vs MI" },
                { title: "Playoff Math", query: "Can RCB still qualify for the IPL 2025 playoffs?" },
                { title: "Pitch Analysis", query: "Analyze pitch conditions for MA Chidambaram Stadium Chepauk" }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenAIWithQuery(chip.query)}
                  className="p-3 text-left rounded-xl bg-pitch-card hover:bg-pitch-surface border border-pitch-border/70 hover:border-amber-500/50 transition group flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                      {chip.title}
                    </span>
                    <span className="text-slate-300 group-hover:text-white font-medium">
                      {chip.query}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Standings Snapshot */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white tracking-wide">IPL Points Table</h2>
            </div>
            <button 
              onClick={() => onNavigate('standings')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Full Table
            </button>
          </div>

          <div className="rounded-xl glass-panel overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B0F1A] text-slate-400 border-b border-pitch-border uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Pos</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-3 text-right">Pts</th>
                  <th className="py-2.5 px-3 text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pitch-border/40">
                {standings.slice(0, 6).map((s) => (
                  <tr key={s.team_id} className="hover:bg-pitch-surface/40 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-400">
                      <span className={`w-5 h-5 inline-flex items-center justify-center rounded text-[10px] ${
                        s.position <= 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500'
                      }`}>
                        {s.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.color }}
                        ></span>
                        <span className="font-bold text-white">{s.short_name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-300">{s.played}</td>
                    <td className="py-2.5 px-2 text-center text-slate-300">{s.won}</td>
                    <td className="py-2.5 px-3 text-right font-black text-amber-400">{s.points}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {s.nrr > 0 ? `+${s.nrr.toFixed(3)}` : s.nrr.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Franchise Roster Shortcut */}
          <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Official IPL Franchises</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Explore 10 team squads and records</p>
            </div>
            <button
              onClick={() => onNavigate('teams')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition"
            >
              Explore Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
