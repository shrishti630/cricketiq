import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  MapPin, 
  User, 
  Shield, 
  Search, 
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { fetchTeams, fetchPlayers } from '../services/api';
import { Team, Player } from '../types/cricket';

interface TeamsPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({ onOpenAIWithQuery }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams().then(setTeams);
    fetchPlayers().then(setPlayers);
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.short_name.toLowerCase().includes(search.toLowerCase()) ||
    t.captain?.toLowerCase().includes(search.toLowerCase())
  );

  const teamSquad = selectedTeam ? players.filter(p => p.team_id === selectedTeam.id) : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2 tracking-tight">
            <span>IPL Club Hubs</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              10 Franchises
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete club analytics, championship records, coaching staffs, and player rosters.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams or captains..."
            className="w-full bg-white border border-slate-200 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 cursor-pointer shadow-xs hover:shadow-md hover:border-slate-300 transition"
          >
            {/* Top Color Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
              style={{ backgroundColor: team.primary_color }}
            ></div>

            <div className="flex items-start justify-between">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                style={{ backgroundColor: team.primary_color }}
              >
                {team.short_name}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  <span>{team.titles} {team.titles === 1 ? 'Title' : 'Titles'}</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Est. {team.founded}</p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition">
                {team.name}
              </h3>
              
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Captain: <strong className="text-slate-800">{team.captain || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Head Coach: <strong className="text-slate-800">{team.coach || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Home: <strong className="text-slate-800">{team.home_venue}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center">
                Explore Squad Hub <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Team Detail / Squad Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md"
                  style={{ backgroundColor: selectedTeam.primary_color }}
                >
                  {selectedTeam.short_name}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedTeam.name}</h2>
                  <p className="text-xs text-slate-500">
                    Captain: {selectedTeam.captain} • Coach: {selectedTeam.coach}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Action Strip */}
            <div className="py-3 px-4 my-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-800 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Launch tactical AI scout for {selectedTeam.short_name} squad</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  onOpenAIWithQuery(`Tactical squad analysis for ${selectedTeam.name}: batting depth, bowling economy, and key match winners`);
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-extrabold transition cursor-pointer"
              >
                Analyze Squad
              </button>
            </div>

            {/* Squad List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Squad Roster
              </h4>
              {teamSquad.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {p.name} {p.is_captain && '⭐ (C)'}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {p.role} • {p.batting_style}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-700 font-bold text-xs">
                      {p.stats?.runs ? `${p.stats.runs} runs (SR ${p.stats.strike_rate})` : `${p.stats?.wickets} wkts (Econ ${p.stats?.economy_rate})`}
                    </span>
                    <span className="block text-[10px] text-slate-500">Form: {p.recent_form}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
