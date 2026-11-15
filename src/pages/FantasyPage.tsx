import React, { useEffect, useState } from 'react';
import { 
  Sparkles
} from 'lucide-react';
import { fetchPlayers, optimizeFantasySquad } from '../services/api';
import { Player } from '../types/cricket';

interface FantasyPageProps {
  onOpenAIWithQuery: (q: string) => void;
}

export const FantasyPage: React.FC<FantasyPageProps> = () => {
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [vcId, setVcId] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchPlayers().then(setAvailablePlayers);
    handleAutoOptimize();
  }, []);

  const handleAutoOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await optimizeFantasySquad('CSK', 'MI');
      if (res && res.squad) {
        setSelectedPlayers(res.squad);
        if (res.squad[0]) setCaptainId(res.squad[0].id);
        if (res.squad[1]) setVcId(res.squad[1].id);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2 tracking-tight">
            <span>Fantasy XI Studio & Pitch Builder</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Dream11 / IPL Rules
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build your optimal 11 with deterministic budget constraints and tactical captaincy multipliers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAutoOptimize}
            disabled={optimizing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black text-xs font-extrabold shadow-sm transition flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{optimizing ? 'Solving Constraints...' : 'AI Auto-Optimize Squad'}</span>
          </button>
        </div>
      </div>

      {/* Constraints Dashboard Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block font-semibold">Players Selected</span>
          <span className={`text-xl font-black font-mono mt-0.5 block ${
            selectedPlayers.length === 11 ? 'text-emerald-700' : 'text-amber-700'
          }`}>
            {selectedPlayers.length} / 11
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block font-semibold">Credits Used</span>
          <span className={`text-xl font-black font-mono mt-0.5 block ${
            totalCredits <= 100.0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {totalCredits.toFixed(1)} / 100.0
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Remaining: {creditsRemaining.toFixed(1)}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block font-semibold">Role Balance</span>
          <span className="text-xs font-mono font-bold text-slate-800 mt-1 block">
            WK: {roleCounts.WK} | BAT: {roleCounts.BAT} | AR: {roleCounts.AR} | BOWL: {roleCounts.BOWL}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block font-semibold">Captain & Vice-Captain</span>
          <span className="text-xs font-bold text-amber-800 mt-1 block truncate">
            C: {selectedPlayers.find(p => p.id === captainId)?.name || 'Select'} | VC: {selectedPlayers.find(p => p.id === vcId)?.name || 'Select'}
          </span>
        </div>
      </div>

      {/* Main Pitch & Squad Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Visual Cricket Pitch Board */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-gradient-to-b from-[#14532D] via-[#166534] to-[#14532D] shadow-md relative overflow-hidden border border-emerald-800">
          {/* Pitch Markings */}
          <div className="absolute inset-x-8 top-10 bottom-10 border border-emerald-300/30 rounded-xl pointer-events-none"></div>
          <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 h-28 border-y border-emerald-200/40 bg-emerald-700/20 pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            {/* WICKET KEEPERS */}
            <div>
              <div className="text-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-400/40">
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
              <div className="text-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-400/40">
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
              <div className="text-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-400/40">
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
              <div className="text-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-400/40">
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
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Match Player Pool</h3>
            <span className="text-xs text-slate-500 font-medium">Click to add/remove</span>
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
                      ? 'bg-amber-50 border-amber-300 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-slate-900 block">
                      {player.name} {player.is_captain && '⭐'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {player.team_id} • {player.role} • Form: {player.recent_form}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-amber-700">{player.credits} Cr</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-amber-500 text-black' : 'bg-slate-200 text-slate-600'
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
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center p-1 shadow-md hover:scale-105 transition">
        <span className="text-[9px] font-black text-amber-700 uppercase tracking-tighter">
          {player.team_id}
        </span>
        <span className="text-[10px] font-extrabold text-slate-900 truncate max-w-[40px]">
          {player.name.split(' ').pop()}
        </span>
        <span className="text-[8px] font-mono text-slate-500">{player.credits} Cr</span>
      </div>

      {/* Multiplier Badges */}
      {isCaptain && (
        <span className="absolute -top-2 -right-1 px-1 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black shadow-xs">
          2x
        </span>
      )}
      {isVC && (
        <span className="absolute -top-2 -right-1 px-1 py-0.2 rounded bg-cyan-500 text-white text-[9px] font-black shadow-xs">
          1.5x
        </span>
      )}

      {/* Quick Action Popover on Hover */}
      <div className="hidden group-hover:flex absolute -bottom-7 bg-white border border-slate-200 rounded-md px-1.5 py-0.5 space-x-1.5 text-[9px] z-20 shadow-md">
        <button onClick={onSetCaptain} className="text-amber-700 font-bold hover:underline cursor-pointer">C</button>
        <span className="text-slate-300">|</span>
        <button onClick={onSetVC} className="text-blue-700 font-bold hover:underline cursor-pointer">VC</button>
        <span className="text-slate-300">|</span>
        <button onClick={onRemove} className="text-red-600 font-bold hover:underline cursor-pointer">✕</button>
      </div>
    </div>
  );
};
