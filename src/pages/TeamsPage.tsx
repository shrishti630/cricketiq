import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Users, 
  MapPin, 
  User, 
  Shield, 
  Search, 
  ExternalLink,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { fetchTeams } from '../services/api';
import { Team } from '../types/cricket';

interface TeamsPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({ onOpenAIWithQuery }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamDetail, setTeamDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchTeams().then(setTeams);
  }, []);

  const handleSelectTeam = async (t: Team) => {
    setSelectedTeam(t);
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://localhost:8000/api/teams/${t.id}`);
      if (res.ok) {
        const data = await res.json();
        setTeamDetail(data);
      } else {
        setTeamDetail(t);
      }
    } catch {
      setTeamDetail(t);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.short_name.toLowerCase().includes(search.toLowerCase()) ||
    t.captain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-pitch-border/60">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span>IPL Club Hubs</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              10 Franchises
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete club analytics, championship records, coaching staffs, and player rosters.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams or captains..."
            className="w-full bg-pitch-surface border border-pitch-border focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => handleSelectTeam(team)}
            className="group relative overflow-hidden rounded-2xl glass-panel glass-panel-hover p-6 cursor-pointer border-pitch-border/80"
          >
            {/* Top Color Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
              style={{ backgroundColor: team.primary_color }}
            ></div>

            <div className="flex items-start justify-between">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0"
                style={{ backgroundColor: team.primary_color }}
              >
                {team.short_name}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>{team.titles} {team.titles === 1 ? 'Title' : 'Titles'}</span>
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Est. {team.founded}</p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition">
                {team.name}
              </h3>
              
              <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Captain: <strong className="text-slate-200">{team.captain || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Head Coach: <strong className="text-slate-200">{team.coach || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">Home: <strong className="text-slate-200">{team.home_venue}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-pitch-border/50 flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center">
                Explore Squad Hub <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Team Detail / Squad Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#0B0F1A] border border-pitch-border rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-pitch-border/60">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md"
                  style={{ backgroundColor: selectedTeam.primary_color }}
                >
                  {selectedTeam.short_name}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedTeam.name}</h2>
                  <p className="text-xs text-slate-400">
                    Captain: {selectedTeam.captain} • Coach: {selectedTeam.coach}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedTeam(null); setTeamDetail(null); }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-pitch-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Action Strip */}
            <div className="py-3 px-4 my-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-purple-950/20 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch deep tactical AI scout for {selectedTeam.short_name} squad</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  onOpenAIWithQuery(`Tactical squad analysis for ${selectedTeam.name}: batting depth, bowling economy, and key match winners`);
                }}
                className="px-3 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
              >
                Analyze Squad
              </button>
            </div>

            {/* Squad List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Squad Roster
              </h4>
              {loadingDetail ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading squad statistics...</div>
              ) : (
                (teamDetail?.squad || []).map((p: any) => (
                  <div key={p.id} className="p-3 rounded-xl bg-pitch-card border border-pitch-border/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">
                        {p.name} {p.is_captain && '⭐ (C)'}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {p.role} • {p.batting_style}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-amber-400 font-bold text-xs">
                        {p.runs ? `${p.runs} runs (SR ${p.strike_rate})` : `${p.wickets} wkts (Econ ${p.economy})`}
                      </span>
                      <span className="block text-[10px] text-slate-500">Form: {p.recent_form}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
