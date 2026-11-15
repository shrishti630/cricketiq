import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Activity, 
  BarChart3, 
  Bot, 
  Sparkles, 
  Zap,
  Key,
  X,
  Check,
  Radio,
  Globe
} from 'lucide-react';
import { getGeminiKey, setGeminiKey, saveLiveKey, fetchLiveStatus } from '../../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAIDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAIDrawer }) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [modalTab, setModalTab] = useState<'gemini' | 'cricbuzz'>('cricbuzz');
  const [geminiKeyInput, setGeminiKeyInput] = useState(getGeminiKey());
  const [cricbuzzKeyInput, setCricbuzzKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [liveProviderInfo, setLiveProviderInfo] = useState<any>(null);

  useEffect(() => {
    if (showKeyModal) {
      fetchLiveStatus().then(res => setLiveProviderInfo(res?.configuration || null));
    }
  }, [showKeyModal]);

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

  const handleSaveGemini = () => {
    setGeminiKey(geminiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleSaveCricbuzz = async () => {
    if (cricbuzzKeyInput.trim()) {
      await saveLiveKey('rapidapi_cricbuzz', cricbuzzKeyInput.trim());
      const status = await fetchLiveStatus();
      setLiveProviderInfo(status?.configuration || null);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Franchise Mini Crest Ticker */}
      <div className="hidden md:flex items-center justify-between border-b border-slate-100 px-6 py-1.5 text-xs bg-slate-50">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Official Franchises:</span>
          <div className="flex items-center space-x-1.5">
            {franchiseBadges.map((f) => (
              <span 
                key={f.code}
                className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider transition hover:scale-105 cursor-pointer shadow-2xs"
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
          <span className="text-slate-600 font-semibold">PostgreSQL ipl_db Connected</span>
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
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? item.isSpecial
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-2xs'
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

          {/* Quick AI Trigger Action Button & Key Settings */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Connect Live Gemini LLM API Key"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={openAIDrawer}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer space-x-2 border border-amber-300"
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

      {/* Live Integrations Modal (Cricbuzz Live Data + Gemini AI) */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Live Cricket & AI Integrations</h3>
                  <p className="text-[11px] text-slate-500">Live data fetching into PostgreSQL ipl_db</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-slate-100 mt-4">
              <button
                onClick={() => setModalTab('cricbuzz')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  modalTab === 'cricbuzz'
                    ? 'border-amber-500 text-amber-800 bg-amber-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Cricbuzz / Cricket API</span>
              </button>
              <button
                onClick={() => setModalTab('gemini')}
                className={`flex-1 py-2 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  modalTab === 'gemini'
                    ? 'border-amber-500 text-amber-800 bg-amber-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Google Gemini LLM</span>
              </button>
            </div>

            {/* Cricbuzz Tab Content */}
            {modalTab === 'cricbuzz' && (
              <div className="py-4 space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>Active Provider:</span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {liveProviderInfo?.provider || 'Autonomous Cricbuzz Engine'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Syncs active ball-by-ball match states, live player stats, and IPL points table directly into your PostgreSQL <code>ipl_db</code> database.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    RapidAPI Cricbuzz / CricAPI Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={cricbuzzKeyInput}
                    onChange={(e) => setCricbuzzKeyInput(e.target.value)}
                    placeholder="Enter RapidAPI Key or CricAPI Key..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    If you have an official RapidAPI Cricbuzz key, paste it here. If left blank, CricketIQ runs its high-fidelity dynamic live feed engine to update PostgreSQL <code>ipl_db</code> continuously.
                  </p>
                </div>
              </div>
            )}

            {/* Gemini Tab Content */}
            {modalTab === 'gemini' && (
              <div className="py-4 space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <p>
                  Enter your Google <strong>Gemini API Key</strong> to activate live generative reasoning with autonomous PostgreSQL <code>ipl_db</code> tool calling.
                </p>
                <input
                  type="password"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Your key is stored securely in your browser session and used for deep natural language cricket intelligence.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={modalTab === 'cricbuzz' ? handleSaveCricbuzz : handleSaveGemini}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-xs font-black transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Configuration Saved!</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
