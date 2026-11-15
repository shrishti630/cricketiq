import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  Calendar, 
  MapPin,
  Bot,
  RefreshCw
} from 'lucide-react';
import { fetchMatches, fetchStandings, fetchPlayers, syncLiveMatches } from '../services/api';
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
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('Fetching real-time updates from ipl_db...');
    try {
      await syncLiveMatches();
      await loadData();
      setSyncStatus('Live Data Synchronized with PostgreSQL ipl_db');
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus('Synced latest local data');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const liveMatch = matches.find(m => m.status === 'LIVE') || matches[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Live Match Center Banner */}
      {liveMatch && (
        <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
          {/* Subtle gold accent top line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400"></div>

          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-2"></span>
                Match #{liveMatch.match_number} • {liveMatch.status}
              </span>
              <span className="text-xs text-slate-500 flex items-center font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {liveMatch.venue.name}, {liveMatch.venue.city}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSync}
                disabled={syncing}
                title="Fetch real-time score updates from database"
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
              </button>

              <button
                onClick={() => onOpenAIWithQuery(`Analyze tactical state for ${liveMatch.home_team.name} vs ${liveMatch.away_team.name}`)}
                className="flex items-center space-x-2 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Match Intelligence</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="mb-4 -mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{syncStatus}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600">PostgreSQL ipl_db</span>
            </div>
          )}

          {/* Teams Scoreboard Battle */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Home Team */}
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                style={{ backgroundColor: liveMatch.home_team.color }}
              >
                {liveMatch.home_team.short_name}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{liveMatch.home_team.name}</h3>
                <p className="text-2xl font-black text-amber-600 mt-0.5">{liveMatch.home_score || '189/4 (20.0)'}</p>
                <span className="text-xs text-slate-500 font-semibold">1st Innings Target: 190</span>
              </div>
            </div>

            {/* VS & Live State Headline */}
            <div className="text-center px-4">
              <span className="text-xs font-black px-3 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                VS
              </span>
              <p className="text-xs font-semibold text-emerald-700 mt-3 leading-relaxed">
                {liveMatch.live_headline || 'Match in decisive phase'}
              </p>
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-4 md:justify-end text-left md:text-right">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-black text-slate-900">{liveMatch.away_team.name}</h3>
                <p className="text-2xl font-black text-blue-600 mt-0.5">{liveMatch.away_score || '148/5 (15.4)'}</p>
                <span className="text-xs text-slate-500 font-semibold">Req RR: 9.69</span>
              </div>
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0 order-1 md:order-2"
                style={{ backgroundColor: liveMatch.away_team.color }}
              >
                {liveMatch.away_team.short_name}
              </div>
            </div>
          </div>

          {/* Win Probability Bar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-700">
                {liveMatch.home_team.short_name} {liveMatch.win_probability_home}% Win Probability
              </span>
              <span className="text-blue-700">
                {liveMatch.away_team.short_name} {Math.round(100 - liveMatch.win_probability_home)}% Win Probability
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                style={{ width: `${liveMatch.win_probability_home}%` }}
              ></div>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">High-Stakes IPL Fixtures</h2>
            </div>
            <button 
              onClick={() => onNavigate('standings')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Full Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.slice(1, 5).map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-3 border-b border-slate-100">
                    <span className="flex items-center font-medium">
                      <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                      {m.date}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
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
                        <span className="font-bold text-sm text-slate-900">{m.home_team.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{m.home_score || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: m.away_team.color }}
                        ></span>
                        <span className="font-bold text-sm text-slate-900">{m.away_team.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{m.away_score || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[150px] font-medium">{m.venue.city}</span>
                  <button
                    onClick={() => onOpenAIWithQuery(`Tactical preview for ${m.home_team.short_name} vs ${m.away_team.short_name}`)}
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Scout Match</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fast Strategic AI Prompts Chips */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-black text-slate-900">Ask CricketIQ Agent</h3>
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
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-0.5">
                      {chip.title}
                    </span>
                    <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                      {chip.query}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">IPL Points Table</h2>
            </div>
            <button 
              onClick={() => onNavigate('standings')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              Full Table
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3">Team</th>
                  <th className="py-3 px-2 text-center">P</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-3 text-right">Pts</th>
                  <th className="py-3 px-3 text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standings.slice(0, 6).map((s) => (
                  <tr key={s.team_id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-400">
                      <span className={`w-5 h-5 inline-flex items-center justify-center rounded text-[10px] ${
                        s.position <= 4 ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200' : 'text-slate-500'
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
                        <span className="font-bold text-slate-900">{s.short_name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{s.played}</td>
                    <td className="py-2.5 px-2 text-center text-emerald-700 font-bold">{s.won}</td>
                    <td className="py-2.5 px-3 text-right font-black text-amber-600">{s.points}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-600">
                      {s.nrr > 0 ? `+${s.nrr.toFixed(3)}` : s.nrr.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Franchise Roster Shortcut */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Official IPL Franchises</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Explore 10 team squads and records</p>
            </div>
            <button
              onClick={() => onNavigate('teams')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
            >
              Explore Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
