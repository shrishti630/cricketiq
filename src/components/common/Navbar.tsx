import React from 'react';
import { 
  Trophy, 
  Users, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Bot, 
  Sparkles,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAIDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAIDrawer }) => {
  const franchiseBadges = [
    { code: 'CSK', color: '#F9CD05', border: '#D97706' },
    { code: 'MI', color: '#004BA0', border: '#2563EB' },
    { code: 'RCB', color: '#EC1C24', border: '#DC2626' },
    { code: 'KKR', color: '#3A225D', border: '#7C3AED' },
    { code: 'SRH', color: '#F26522', border: '#EA580C' },
    { code: 'RR', color: '#EA1A85', border: '#DB2777' },
    { code: 'GT', color: '#1B2133', border: '#475569' },
    { code: 'LSG', color: '#0057E7', border: '#3B82F6' },
    { code: 'DC', color: '#004C93', border: '#0284C7' },
    { code: 'PK', color: '#ED1B24', border: '#E11D48' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Match Center', icon: Activity },
    { id: 'teams', label: 'Teams (Clubs)', icon: Trophy },
    { id: 'players', label: 'Player Scout', icon: Users },
    { id: 'standings', label: 'IPL Table', icon: BarChart3 },
    { id: 'fantasy', label: 'Fantasy XI Studio', icon: Zap },
    { id: 'ai-war-room', label: 'AI Intelligence Hub', icon: Bot, isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pitch-border/80 bg-[#070A11]/90 backdrop-blur-md">
      {/* Franchise Mini Crest Ticker */}
      <div className="hidden md:flex items-center justify-between border-b border-pitch-border/40 px-6 py-1 text-xs text-slate-400 bg-pitch-dark/80">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Official Franchises:</span>
          <div className="flex items-center space-x-2">
            {franchiseBadges.map((f) => (
              <span 
                key={f.code}
                className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition hover:scale-105 cursor-pointer"
                style={{ backgroundColor: `${f.color}20`, color: f.color, border: `1px solid ${f.border}40` }}
                onClick={() => setActiveTab('teams')}
              >
                {f.code}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
            LIVE: CSK vs MI (15.4 ov)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400/90 font-medium">Season 2025</span>
        </div>
      </div>

      {/* Main Sports Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-glow-gold group-hover:scale-105 transition-transform">
              <span className="text-xl">🏏</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-white">Cricket<span className="text-amber-400">IQ</span></span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Hub</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Premier IPL Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? item.isSpecial
                        ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-400 border border-amber-500/40 shadow-glow-gold'
                        : 'bg-pitch-surface text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-pitch-surface/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isSpecial && (
                    <span className="ml-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black">
                      Agent
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick AI Trigger Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openAIDrawer}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-xl group bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 group-hover:from-amber-600 group-hover:to-yellow-600 hover:text-white text-black shadow-glow-gold transition-all active:scale-95"
            >
              <span className="relative px-3.5 py-2 transition-all ease-in duration-75 bg-[#0A0E17] text-white rounded-[10px] group-hover:bg-opacity-0 group-hover:text-black flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-black animate-pulse" />
                <span className="font-bold">Ask AI Analyst</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 space-x-2 border-t border-pitch-border/50 bg-[#090D15]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition ${
                isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
