import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Bot
} from 'lucide-react';
import { fetchStandings } from '../services/api';
import { StandingRow } from '../types/cricket';

interface StandingsPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const StandingsPage: React.FC<StandingsPageProps> = ({ onOpenAIWithQuery }) => {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [selectedTeamCode, setSelectedTeamCode] = useState<string>('RCB');

  useEffect(() => {
    fetchStandings().then(setStandings);
  }, []);

  const selectedTeam = standings.find(s => s.team_id === selectedTeamCode) || standings[3];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-pitch-border/60">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span>IPL 2025 Standings & Table</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Season 2025
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official league table, form guides, Net Run Rates (NRR), and AI qualification projections.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 mr-1.5"></span>
            Playoff Qualifier (Top 4)
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border-pitch-border/80">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0B0F1A] text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-pitch-border">
              <tr>
                <th className="py-3.5 px-4">Pos</th>
                <th className="py-3.5 px-4">Franchise</th>
                <th className="py-3.5 px-3 text-center">Played</th>
                <th className="py-3.5 px-3 text-center">Won</th>
                <th className="py-3.5 px-3 text-center">Lost</th>
                <th className="py-3.5 px-4 text-center">Recent Form</th>
                <th className="py-3.5 px-4 text-right">Points</th>
                <th className="py-3.5 px-4 text-right">NRR</th>
                <th className="py-3.5 px-4 text-center">Playoff Odds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitch-border/40 font-medium">
              {standings.map((team) => {
                const isTop4 = team.position <= 4;
                return (
                  <tr 
                    key={team.team_id}
                    onClick={() => setSelectedTeamCode(team.team_id)}
                    className={`cursor-pointer transition-colors ${
                      selectedTeamCode === team.team_id ? 'bg-amber-500/10' : 'hover:bg-pitch-surface/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      <span className={`w-6 h-6 inline-flex items-center justify-center rounded-md font-bold text-xs ${
                        isTop4 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold' 
                          : 'text-slate-500 bg-pitch-dark'
                      }`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: team.color }}
                        ></span>
                        <div>
                          <span className="font-extrabold text-white text-sm block">
                            {team.team_name}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase">{team.team_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">{team.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">{team.won}</td>
                    <td className="py-3 px-3 text-center text-red-400 font-bold">{team.lost}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {team.recent_form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded text-[10px] font-black inline-flex items-center justify-center ${
                              res === 'W' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-400 text-sm font-mono">
                      {team.points}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-300">
                      {team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-400">{team.qualification_prob}%</span>
                        </div>
                        <div className="w-full bg-pitch-dark h-1.5 rounded-full overflow-hidden border border-pitch-border/50">
                          <div 
                            className={`h-full ${
                              team.qualification_prob > 75 
                                ? 'bg-emerald-400' 
                                : team.qualification_prob > 25 
                                  ? 'bg-amber-400' 
                                  : 'bg-red-400'
                            }`}
                            style={{ width: `${team.qualification_prob}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Playoff Scenario Simulator Card */}
      {selectedTeam && (
        <section className="p-6 rounded-2xl glass-panel border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-purple-950/10 to-[#0A0E1A]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-pitch-border/60">
            <div className="flex items-center space-x-3">
              <span 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg"
                style={{ backgroundColor: selectedTeam.color }}
              >
                {selectedTeam.short_name}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Playoff Simulation: {selectedTeam.team_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Current Points: <strong>{selectedTeam.points}</strong> • NRR: <strong>{selectedTeam.nrr.toFixed(3)}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenAIWithQuery(`Simulate detailed playoff qualification roadmap for ${selectedTeam.team_name}`)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-glow-gold transition flex items-center space-x-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Simulate with AI Agent</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
            <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border">
              <span className="text-slate-400 text-[11px] block">Qualification Probability</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {selectedTeam.qualification_prob}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedTeam.qualification_prob > 75 ? 'Safe Position' : 'NRR Dependent Zone'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border">
              <span className="text-slate-400 text-[11px] block">Matches Remaining</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                {Math.max(0, 14 - selectedTeam.played)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Maximum 14 League Fixtures</p>
            </div>

            <div className="p-4 rounded-xl bg-pitch-card border border-pitch-border">
              <span className="text-slate-400 text-[11px] block">Target Qualification Points</span>
              <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
                16 PTS
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Guarantees playoff berth without NRR ties</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
