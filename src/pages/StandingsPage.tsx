import React, { useEffect, useState } from 'react';
import { 
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2 tracking-tight">
            <span>IPL 2025 Standings & Table</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Season 2025
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official league table, form guides, Net Run Rates (NRR), and AI qualification projections.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500 font-semibold">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 mr-1.5"></span>
            Playoff Qualifier (Top 4)
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100 font-medium">
              {standings.map((team) => {
                const isTop4 = team.position <= 4;
                return (
                  <tr 
                    key={team.team_id}
                    onClick={() => setSelectedTeamCode(team.team_id)}
                    className={`cursor-pointer transition-colors ${
                      selectedTeamCode === team.team_id ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      <span className={`w-6 h-6 inline-flex items-center justify-center rounded-md font-bold text-xs ${
                        isTop4 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black' 
                          : 'text-slate-500 bg-slate-100'
                      }`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: team.color }}
                        ></span>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">
                            {team.team_name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{team.team_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">{team.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-bold">{team.won}</td>
                    <td className="py-3 px-3 text-center text-red-600 font-bold">{team.lost}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {team.recent_form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded text-[10px] font-black inline-flex items-center justify-center ${
                              res === 'W' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-700 text-sm font-mono">
                      {team.points}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                      {team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-600">{team.qualification_prob}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full ${
                              team.qualification_prob > 75 
                                ? 'bg-emerald-500' 
                                : team.qualification_prob > 25 
                                  ? 'bg-amber-500' 
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
        <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm"
                style={{ backgroundColor: selectedTeam.color }}
              >
                {selectedTeam.short_name}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Playoff Simulation: {selectedTeam.team_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Current Points: <strong>{selectedTeam.points}</strong> • NRR: <strong>{selectedTeam.nrr.toFixed(3)}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenAIWithQuery(`Simulate detailed playoff qualification roadmap for ${selectedTeam.team_name}`)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Simulate with AI Agent</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-semibold">Qualification Probability</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                {selectedTeam.qualification_prob}%
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {selectedTeam.qualification_prob > 75 ? 'Safe Benchmark' : 'NRR Dependent Zone'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-semibold">Matches Remaining</span>
              <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
                {Math.max(0, 14 - selectedTeam.played)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Maximum 14 League Fixtures</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-semibold">Target Safe Points</span>
              <span className="text-2xl font-black text-cyan-700 font-mono mt-1 block">
                16 PTS
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Guarantees playoff qualification</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
