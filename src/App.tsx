import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { TeamsPage } from './pages/TeamsPage';
import { PlayersPage } from './pages/PlayersPage';
import { StandingsPage } from './pages/StandingsPage';
import { FantasyPage } from './pages/FantasyPage';
import { AIWarRoomPage } from './pages/AIWarRoomPage';
import { AIAnalystDrawer } from './components/ai/AIAnalystDrawer';
import { Bot, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [drawerInitialQuery, setDrawerInitialQuery] = useState<string>('');

  const handleOpenAIWithQuery = (q: string) => {
    setDrawerInitialQuery(q);
    setIsAIDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      {/* Premier Zone Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAIDrawer={() => {
          setDrawerInitialQuery('');
          setIsAIDrawerOpen(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardPage 
            onNavigate={setActiveTab} 
            onOpenAIWithQuery={handleOpenAIWithQuery} 
          />
        )}
        {activeTab === 'teams' && (
          <TeamsPage onOpenAIWithQuery={handleOpenAIWithQuery} />
        )}
        {activeTab === 'players' && (
          <PlayersPage onOpenAIWithQuery={handleOpenAIWithQuery} />
        )}
        {activeTab === 'standings' && (
          <StandingsPage onOpenAIWithQuery={handleOpenAIWithQuery} />
        )}
        {activeTab === 'fantasy' && (
          <FantasyPage onOpenAIWithQuery={handleOpenAIWithQuery} />
        )}
        {activeTab === 'ai-war-room' && (
          <AIWarRoomPage />
        )}
      </main>

      {/* Global Slide-out AI Analyst Drawer */}
      <AIAnalystDrawer 
        isOpen={isAIDrawerOpen} 
        onClose={() => setIsAIDrawerOpen(false)}
        initialQuery={drawerInitialQuery}
      />

      {/* Floating Action Button for AI (always accessible on mobile & desktop) */}
      <button
        onClick={() => {
          setDrawerInitialQuery('');
          setIsAIDrawerOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-glow-gold transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 font-black cursor-pointer border border-amber-300/40"
      >
        <Bot className="w-5 h-5 text-black animate-bounce" />
        <span className="text-xs tracking-wider uppercase hidden sm:inline">Ask CricketIQ</span>
      </button>

      {/* Footer */}
      <footer className="border-t border-pitch-border/60 bg-[#060910] py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-white text-sm">Cricket<span className="text-amber-400">IQ</span></span>
            <span>•</span>
            <span>IPL Intelligence Hub & Multi-Agent Analytics Platform</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Factual Cricket Grounding
            </span>
            <span>•</span>
            <span className="text-slate-400">PostgreSQL + FastAPI + React TS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
