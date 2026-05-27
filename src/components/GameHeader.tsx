import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldAlert, Heart, Landmark, RefreshCw, Save } from 'lucide-react';
import { GameStats } from '../types';

interface GameHeaderProps {
  stats: GameStats;
  currentPathName?: string;
  onReset: () => void;
  onSave?: () => boolean;
}

export default function GameHeader({ stats, currentPathName, onReset, onSave }: GameHeaderProps) {
  const [savedIndicator, setSavedIndicator] = useState(false);

  const getCreditBorder = (score: number) => {
    if (score >= 720) return 'border-emerald-500 text-emerald-400';
    if (score >= 620) return 'border-indigo-500 text-indigo-400';
    return 'border-rose-500 text-rose-400';
  };

  const getHappinessEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 50) return '😐';
    if (score >= 30) return '😰';
    return '💀';
  };

  const handleResetClick = () => {
    if (confirm("Reset current game progress and restart payoff simulation?")) {
      onReset();
    }
  };

  return (
    <header className="w-full bg-slate-800/90 border-b-4 border-indigo-500 sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-between gap-4 shadow-xl backdrop-blur select-none">
      {/* Left side: Logo Badge + Title */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-3">
          {/* Coffee cup badge with drop shadow */}
          <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg relative shrink-0">
            <span className="text-2xl font-bold italic select-none">CC</span>
            <span className="absolute -bottom-1 -right-1 text-sm bg-slate-900 border border-slate-700 rounded-full w-5 h-5 flex items-center justify-center">
              {getHappinessEmoji(stats.happiness)}
            </span>
          </div>

          <div>
            <h1 className="text-lg lg:text-xl font-display font-black uppercase tracking-tighter text-indigo-300 flex items-center gap-2">
              Cash Course
              <span className="text-[10px] bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono font-bold tracking-wide border border-indigo-900/40">
                Barista Lvl 1
              </span>
            </h1>
            <p className="text-xs font-bold text-slate-400 font-sans">
              {currentPathName ? (
                <span className="text-teal-400 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  PATH: {currentPathName}
                </span>
              ) : (
                'EPISODE 1: THE FIRST PAYCHECK'
              )}
            </p>
          </div>
        </div>

        {/* Mobile Reset Action */}
        <button
          onClick={handleResetClick}
          title="Reset Game"
          className="lg:hidden p-2 rounded-xl border-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Right side: Stat Boxes */}
      <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
        
        {/* Net Worth (Cash) */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl px-4 py-1 shadow-sm shrink-0 min-w-[85px] lg:min-w-[100px]">
          <p className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Wallet size={10} /> CASH
          </p>
          <motion.p 
            key={stats.cash}
            initial={{ scale: 1.15, color: '#10b981' }}
            animate={{ scale: 1, color: '#f8fafc' }}
            className="text-base lg:text-lg font-mono font-bold text-slate-50 font-black"
          >
            ${stats.cash}
          </motion.p>
        </div>

        {/* Debt Tag */}
        <div className={`bg-slate-900 border-2 rounded-xl px-4 py-1 shadow-sm shrink-0 min-w-[85px] lg:min-w-[100px] ${stats.debt > 0 ? 'border-rose-500' : 'border-slate-700 opacity-60'}`}>
          <p className={`text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${stats.debt > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            <Landmark size={10} /> DEBT
          </p>
          <motion.p 
            key={stats.debt}
            initial={stats.debt > 0 ? { scale: 1.15, color: '#f43f5e' } : {}}
            animate={{ scale: 1 }}
            className={`text-base lg:text-lg font-mono font-bold font-black ${stats.debt > 0 ? 'text-rose-400' : 'text-slate-300'}`}
          >
            ${stats.debt}
          </motion.p>
        </div>

        {/* Credit Score */}
        <div className={`bg-slate-900 border-2 rounded-xl px-4 py-1 shadow-sm shrink-0 min-w-[85px] lg:min-w-[100px] ${getCreditBorder(stats.creditScore)}`}>
          <p className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 opacity-70">
            <ShieldAlert size={10} /> CREDIT
          </p>
          <p className="text-base lg:text-lg font-mono font-bold font-black">
            {stats.creditScore}
          </p>
        </div>

        {/* Happiness Meter */}
        <div className="bg-slate-900 border-2 border-amber-400 rounded-xl px-4 py-1 shadow-sm shrink-0 min-w-[110px] lg:min-w-[120px]">
          <p className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Heart size={10} /> MOOD
          </p>
          <div className="flex gap-2 items-center mt-0.5">
            <div className="h-2 w-10 bg-slate-800 rounded-full overflow-hidden hidden lg:block border border-slate-700/50">
              <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${stats.happiness}%` }}></div>
            </div>
            <span className="text-sm lg:text-base font-bold text-slate-50 font-mono">{stats.happiness}%</span>
          </div>
        </div>

        {/* Save Game Button */}
        {onSave && (
          <button
            onClick={() => {
              const ok = onSave();
              if (ok) {
                setSavedIndicator(true);
                setTimeout(() => setSavedIndicator(false), 1500);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-mono text-xs transition-all scale-100 active:scale-95 shrink-0 cursor-pointer text-white font-bold uppercase shadow ${
              savedIndicator 
                ? 'bg-emerald-600 border-emerald-405 border-emerald-400 text-emerald-100 animate-pulse' 
                : 'bg-slate-900 border-slate-700 hover:border-teal-500/50 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Save size={14} className={savedIndicator ? 'text-emerald-100 animate-spin-fast' : 'text-teal-400'} />
            <span>{savedIndicator ? 'Saved! ✅' : 'Save 💾'}</span>
          </button>
        )}

        {/* Desktop Reset Button */}
        <button
          onClick={handleResetClick}
          title="Reset simulation parameters"
          className="hidden lg:flex p-2.5 rounded-xl border-2 border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all scale-100 active:scale-95 shrink-0 cursor-pointer"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
