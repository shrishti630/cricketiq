import React from 'react';
import { 
  Trophy, 
  Users, 
  Activity, 
  BarChart3, 
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
    { code: 'CSK', color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
    { code: 'MI', color: '#1D4ED8', bg: '#DBEAFE', border: '#BFDBFE' },
    { code: 'RCB', color: '#B91C1C', bg: '#FEE2E2', border: '#FECACA' },
    { code: 'KKR', color: '#6D28D9', bg: '#EDE9FE', border: '#DDD6FE' },
    { code: 'SRH', color: '#C2410C', bg: '#FFEDD5', border: '#FED7AA' },
    { code: 'RR', color: '#BE185D', bg: '#FCE7F3', border: '#FBCFE8' },
    { code: 'GT', color: '#334155', bg: '#F1F5F9', border: '#E2E8F0' },
    { code: 'LSG', color: '#0369A1', bg: '#E0F2FE', border: '#BAE6FD' },
    { code: 'DC', color: '#0284C7', bg: '#E0F2FE', border: '#BAE6FD' },
    { code: 'PK', color: '#BE123C', bg: '#FFE4E6', border: '#FECDD3' },
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Franchise Mini Crest Ticker */}
      <div className="hidden md:flex items-center justify-between border-b border-slate-100 px-6 py-1.5 text-xs bg-slate-50">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Official Franchises:</span>
          <div className="flex items-center space-x-1.5">
            {franchiseBadges.map((f) => (
              <span 
                key={f.code}
                className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider transition hover:scale-105 cursor-pointer shadow-xs"
                style={{ backgroundColor: f.bg, color: f.color, border: `1px solid ${f.border}` }}
                onClick={() => setActiveTab('teams')}
              >
                {f.code}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center text-emerald-600 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
            LIVE: CSK vs MI (15.4 ov)
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-semibold">Season 2025</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🏏</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">Cricket<span className="text-amber-500">IQ</span></span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">Hub</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Premier IPL Intelligence</p>
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
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isSpecial && (
                    <span className="ml-1 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
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
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer space-x-2 border border-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Ask AI Analyst</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-200 bg-white">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                isActive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-600 hover:text-slate-900'
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
