import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Star, 
  Award,
  Bot
} from 'lucide-react';
import { fetchPlayers, optimizeFantasySquad, validateFantasySquad } from '../services/api';
import { Player } from '../types/cricket';

interface FantasyPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const FantasyPage: React.FC<FantasyPageProps> = ({ onOpenAIWithQuery }) => {
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [vcId, setVcId] = useState<number | null>(null);
  const [team1, setTeam1] = useState('CSK');
  const [team2, setTeam2] = useState('MI');
  const [optimizing, setOptimizing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    fetchPlayers().then(setAvailablePlayers);
    handleAutoOptimize();
  }, []);

  const handleAutoOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await optimizeFantasySquad(team1, team2);
      if (res && res.squad) {
        // Map to players
        const squadIds = new Set(res.squad.map((p: any) => p.id));
        const matched = availablePlayers.filter(p => squadIds.has(p.id));
        setSelectedPlayers(matched.length === 11 ? matched : res.squad);

        const cap = res.squad.find((p: any) => p.is_captain);
        const vc = res.squad.find((p: any) => p.is_vice_captain);
        if (cap) setCaptainId(cap.id);
        if (vc) setVcId(vc.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  const totalCredits = selectedPlayers.reduce((sum, p) => sum + (p.credits || 8.5), 0);
  const creditsRemaining = 100.0 - totalCredits;

  const roleCounts = {
    WK: selectedPlayers.filter(p => p.role === 'Wicket-Keeper').length,
    BAT: selectedPlayers.filter(p => p.role === 'Batsman').length,
    AR: selectedPlayers.filter(p => p.role === 'All-Rounder').length,
    BOWL: selectedPlayers.filter(p => p.role === 'Bowler').length,
  };

  const handleTogglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      if (captainId === player.id) setCaptainId(null);
      if (vcId === player.id) setVcId(null);
    } else {
      if (selectedPlayers.length >= 11) return;
      if (totalCredits + player.credits > 100.0) return;
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-pitch-border/60">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span>Fantasy XI Studio & Pitch Builder</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Dream11 / IPL Rules
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build your optimal 11 with deterministic budget constraints and tactical captaincy multipliers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAutoOptimize}
            disabled={optimizing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-yellow-500 text-black text-xs font-extrabold shadow-glow-gold transition flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{optimizing ? 'Solving Constraints...' : 'AI Auto-Optimize Squad'}</span>
          </button>
        </div>
      </div>

      {/* Constraints Dashboard Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
        <div className="p-4 rounded-xl glass-panel">
          <span className="text-slate-400 text-[11px] block">Players Selected</span>
          <span className={`text-xl font-black font-mono mt-0.5 block ${
            selectedPlayers.length === 11 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {selectedPlayers.length} / 11
          </span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-slate-400 text-[11px] block">Credits Used</span>
          <span className={`text-xl font-black font-mono mt-0.5 block ${
            totalCredits <= 100.0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {totalCredits.toFixed(1)} / 100.0
          </span>
          <span className="text-[10px] text-slate-500">Remaining: {creditsRemaining.toFixed(1)}</span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-slate-400 text-[11px] block">Role Balance</span>
          <span className="text-xs font-mono font-bold text-slate-200 mt-1 block">
            WK: {roleCounts.WK} | BAT: {roleCounts.BAT} | AR: {roleCounts.AR} | BOWL: {roleCounts.BOWL}
          </span>
        </div>

        <div className="p-4 rounded-xl glass-panel">
          <span className="text-slate-400 text-[11px] block">Captain & Vice-Captain</span>
          <span className="text-xs font-bold text-amber-400 mt-1 block truncate">
            C: {selectedPlayers.find(p => p.id === captainId)?.name || 'Select'} | VC: {selectedPlayers.find(p => p.id === vcId)?.name || 'Select'}
          </span>
        </div>
      </div>

      {/* Main Pitch & Squad Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Visual Cricket Pitch Board */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-emerald-500/30 bg-gradient-to-b from-[#062414] via-[#091D12] to-[#0A120E] shadow-2xl relative overflow-hidden">
          {/* Pitch Markings */}
          <div className="absolute inset-x-8 top-12 bottom-12 border border-emerald-500/20 rounded-xl pointer-events-none"></div>
          <div className="absolute inset-x-24 top-1/2 -translate-y-1/2 h-28 border-y border-emerald-500/30 bg-emerald-950/20 pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            {/* WICKET KEEPERS */}
            <div>
              <div className="text-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  Wicket-Keepers (1-4)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedPlayers.filter(p => p.role === 'Wicket-Keeper').map(p => (
                  <PitchPlayerToken
                    key={p.id}
                    player={p}
                    isCaptain={p.id === captainId}
                    isVC={p.id === vcId}
                    onSetCaptain={() => setCaptainId(p.id)}
                    onSetVC={() => setVcId(p.id)}
                    onRemove={() => handleTogglePlayer(p)}
                  />
                ))}
              </div>
            </div>

            {/* BATSMEN */}
            <div>
              <div className="text-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  Batsmen (3-6)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedPlayers.filter(p => p.role === 'Batsman').map(p => (
                  <PitchPlayerToken
                    key={p.id}
                    player={p}
                    isCaptain={p.id === captainId}
                    isVC={p.id === vcId}
                    onSetCaptain={() => setCaptainId(p.id)}
                    onSetVC={() => setVcId(p.id)}
                    onRemove={() => handleTogglePlayer(p)}
                  />
                ))}
              </div>
            </div>

            {/* ALL-ROUNDERS */}
            <div>
              <div className="text-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  All-Rounders (1-4)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedPlayers.filter(p => p.role === 'All-Rounder').map(p => (
                  <PitchPlayerToken
                    key={p.id}
                    player={p}
                    isCaptain={p.id === captainId}
                    isVC={p.id === vcId}
                    onSetCaptain={() => setCaptainId(p.id)}
                    onSetVC={() => setVcId(p.id)}
                    onRemove={() => handleTogglePlayer(p)}
                  />
                ))}
              </div>
            </div>

            {/* BOWLERS */}
            <div>
              <div className="text-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  Bowlers (3-6)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedPlayers.filter(p => p.role === 'Bowler').map(p => (
                  <PitchPlayerToken
                    key={p.id}
                    player={p}
                    isCaptain={p.id === captainId}
                    isVC={p.id === vcId}
                    onSetCaptain={() => setCaptainId(p.id)}
                    onSetVC={() => setVcId(p.id)}
                    onRemove={() => handleTogglePlayer(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Available Player Pool */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-pitch-border/60">
            <h3 className="text-sm font-extrabold text-white">Match Player Pool</h3>
            <span className="text-xs text-slate-400">Click to add/remove</span>
          </div>

          <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
            {availablePlayers.map((player) => {
              const isSelected = selectedPlayers.some(p => p.id === player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => handleTogglePlayer(player)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-pitch-surface/60 border-pitch-border/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white block">
                      {player.name} {player.is_captain && '⭐'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {player.team_id} • {player.role} • Form: {player.recent_form}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-amber-400">{player.credits} Cr</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-pitch-dark text-slate-500'
                    }`}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PitchPlayerTokenProps {
  player: Player;
  isCaptain: boolean;
  isVC: boolean;
  onSetCaptain: () => void;
  onSetVC: () => void;
  onRemove: () => void;
}

const PitchPlayerToken: React.FC<PitchPlayerTokenProps> = ({
  player,
  isCaptain,
  isVC,
  onSetCaptain,
  onSetVC,
  onRemove
}) => {
  return (
    <div className="relative group flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-pitch-dark/90 border border-emerald-500/50 flex flex-col items-center justify-center p-1 shadow-lg hover:scale-105 transition">
        <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">
          {player.team_id}
        </span>
        <span className="text-[10px] font-extrabold text-white truncate max-w-[40px]">
          {player.name.split(' ').pop()}
        </span>
        <span className="text-[8px] font-mono text-slate-400">{player.credits} Cr</span>
      </div>

      {/* Multiplier Badges */}
      {isCaptain && (
        <span className="absolute -top-2 -right-1 px-1 py-0.2 rounded bg-amber-500 text-black text-[9px] font-black shadow">
          2x
        </span>
      )}
      {isVC && (
        <span className="absolute -top-2 -right-1 px-1 py-0.2 rounded bg-cyan-400 text-black text-[9px] font-black shadow">
          1.5x
        </span>
      )}

      {/* Quick Action Popover on Hover */}
      <div className="hidden group-hover:flex absolute -bottom-7 bg-pitch-dark border border-pitch-border rounded-md px-1.5 py-0.5 space-x-1 text-[9px] z-20 shadow-xl">
        <button onClick={onSetCaptain} className="text-amber-400 font-bold hover:underline">C</button>
        <span className="text-slate-600">|</span>
        <button onClick={onSetVC} className="text-cyan-400 font-bold hover:underline">VC</button>
        <span className="text-slate-600">|</span>
        <button onClick={onRemove} className="text-red-400 font-bold hover:underline">✕</button>
      </div>
    </div>
  );
};
