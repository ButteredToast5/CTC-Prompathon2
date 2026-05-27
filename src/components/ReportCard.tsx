import { motion } from 'motion/react';
import { RotateCcw, Star, Coins, CreditCard, Award } from 'lucide-react';
import { GameStats } from '../types';

interface ReportCardProps {
  stats: GameStats;
  pathExplanation: string;
  onRestart: () => void;
  playerName?: string;
}

export default function ReportCard({ stats, pathExplanation, onRestart, playerName = 'Petr' }: ReportCardProps) {
  
  // sound triggers
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  };

  const handleRestartClick = () => {
    playBeep(523, 'sine', 0.1);
    setTimeout(() => playBeep(659, 'sine', 0.1), 100);
    setTimeout(() => playBeep(784, 'sine', 0.25), 200);
    onRestart();
  };

  // Determine financial persona based on ending stats
  const getPersona = () => {
    if (stats.cash === 0 && stats.debt > 0 && stats.happiness <= 20) {
      return {
        title: 'The Out-Of-Pocket Debtor',
        tag: 'DANGER ZONE',
        desc: `Oh dear. ${playerName} is heavily bogged down by double-digit interest rates and penalty overdraft additions. Repayments eat his daily paycheck before he even wakes up.`,
        color: 'text-rose-400 border-rose-500/20 bg-rose-950/10',
        badgeColor: 'bg-rose-950 border border-rose-900 text-rose-400'
      };
    } else if (stats.cash === 0 && stats.happiness < 30) {
      return {
        title: 'The Speculative Gambler',
        tag: 'HIGH SPECULATION',
        desc: 'Entered hoping to 100x wages over simple slot cards or lottery ticket assets. Ended up face to face with empty pockets and zero school laptops.',
        color: 'text-rose-400 border-rose-500/20 bg-rose-950/10',
        badgeColor: 'bg-rose-950 border border-rose-900 text-rose-400'
      };
    } else if (stats.creditScore >= 720 && stats.cash > 200 && stats.debt === 0) {
      return {
        title: 'The Certified Credit Architect',
        tag: 'MASTER CLASS',
        desc: `${playerName} opened checks, established reliable credit using security deposits, and kept spending securely within his cash limits! Magnificent budgeting form.`,
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
        badgeColor: 'bg-emerald-955 border border-emerald-900 text-emerald-400'
      };
    } else if (stats.cash > 550 && stats.happiness >= 70) {
      return {
        title: 'The Sovereign Compounder',
        tag: 'STRATEGIC VISION',
        desc: "Tapped Maya's wisdom, bypassed doge tokens, and automated index investments. Compounded dividends will fund multiple laptops in the future!",
        color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10',
        badgeColor: 'bg-cyan-955 border border-cyan-900 text-cyan-400'
      };
    } else if (stats.debt > 0 && stats.creditScore < 580) {
      return {
        title: 'The App-Fueled Microspender',
        tag: 'BNPL TRAPPED',
        desc: `Overdrafted by stacking invisible installments. ${playerName} bought into easy buy-now buttons only to be struck down by payday's automatic drafts.`,
        color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
        badgeColor: 'bg-amber-955 border border-amber-900 text-amber-400'
      };
    } else {
      return {
        title: 'Pragmatic Modern Budgeter',
        tag: 'BALANCED STANDARD',
        desc: `${playerName} avoided dangerous traps and carries minor risk, though there is room to streamline compounding strategies and secured credit limits.`,
        color: 'text-indigo-400 border-indigo-500/25 bg-indigo-950/10',
        badgeColor: 'bg-indigo-955 border border-indigo-900 text-indigo-400'
      };
    }
  };

  const persona = getPersona();

  // Determine stars out of 5
  const getStarsRating = () => {
    let score = 0;
    if (stats.cash > 500) score += 2;
    else if (stats.cash > 300) score += 1;

    if (stats.creditScore >= 700) score += 2;
    else if (stats.creditScore >= 620) score += 1;

    if (stats.debt === 0) score += 1;

    return Math.max(1, Math.min(5, score));
  };

  const stars = getStarsRating();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* 1. REPORT TITLE HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border-4 border-slate-705 border-slate-700 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/15 rounded-full filter blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/15 rounded-full filter blur-2xl pointer-events-none" />

        <div className="space-y-2.5 relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/10 mb-2">
            <Award size={32} className="text-slate-950" />
          </div>
          <span className="font-mono text-indigo-400 font-black uppercase tracking-widest text-[11px]">{playerName}'s Payday Crossroads Completion</span>
          <h1 className="text-3xl font-display font-black text-white leading-tight">Course Report Card</h1>
          
          {/* Visual star grade ratings */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                className={`${i < stars ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-800'}`} 
                size={24} 
              />
            ))}
          </div>
        </div>

        {/* Narrative recap box */}
        <div className="bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-left space-y-3">
          <h3 className="font-mono text-[10px] uppercase text-slate-500 border-b border-slate-900 pb-2 font-black tracking-widest flex items-center gap-1.5">
            <span>📝</span> Pathway Recap Summary
          </h3>
          <p className="text-xs text-slate-350 leading-relaxed font-sans">
            {pathExplanation}
          </p>
        </div>

        {/* Dynamic Persona Block */}
        <div className={`p-6 rounded-2xl border-2 text-left space-y-3.5 ${persona.color}`}>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-black text-slate-400">PETR'S FINANCIAL PERSONA:</span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-widest ${persona.badgeColor}`}>
              {persona.tag}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-display font-black text-white">{persona.title}</h2>
            <p className="text-slate-300 text-xs leading-normal">
              {persona.desc}
            </p>
          </div>
        </div>

        {/* Core End metrics breakdown grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950 border-2 border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-black block mb-0.5">Ending cash</span>
            <strong className="text-xl font-bold font-mono text-emerald-400 tracking-tight">${stats.cash}</strong>
          </div>
          <div className="bg-slate-950 border-2 border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-black block mb-0.5">Total Debt</span>
            <strong className={`text-xl font-bold font-mono tracking-tight ${stats.debt > 0 ? 'text-rose-455 text-rose-400' : 'text-slate-500'}`}>
              ${stats.debt}
            </strong>
          </div>
          <div className="bg-slate-950 border-2 border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-black block mb-0.5">Credit Score</span>
            <strong className="text-xl font-bold font-mono text-indigo-400 tracking-tight">{stats.creditScore}</strong>
          </div>
        </div>
      </motion.div>

      {/* 2. THE CHRONO KEY LESSONS CARDS */}
      <div className="space-y-4 text-left">
        <h3 className="font-mono text-xs uppercase text-slate-400 tracking-widest font-bold">
          💡 Core Key Paycheck Lessons:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 flex gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 h-11 w-11 rounded-lg shrink-0 flex items-center justify-center bg-indigo-950">
              <CreditCard size={20} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-display font-black text-sm text-slate-200">Credit is Borrowed Money</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1 text-[11px]">
                A solid credit rating is built iteratively through on-time repayments. Stacked balances face punishing 29.9% APR monthly compound expenses.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 flex gap-4">
            <div className="p-3 bg-emerald-505/10 bg-emerald-500/10 text-emerald-400 h-11 w-11 rounded-lg shrink-0 flex items-center justify-center bg-emerald-950">
              <Coins size={20} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-display font-black text-sm text-slate-200">The Power of Compound Returns</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1 text-[11px]">
                Consistently indexing low-cost funds grows capital safely over long duration cycles. Fast micro-speculations generate heavy loss ratios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REPLAY / ACTION BUTTONS */}
      <div className="flex flex-col items-center pt-2">
        <button
          id="btn-restart-game"
          onClick={handleRestartClick}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-900 text-slate-950 font-display font-black text-base rounded-2xl cursor-pointer shadow-lg active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 flex items-center gap-2"
        >
          <RotateCcw size={18} className="stroke-[3]" />
          <span>Rewind Time & Try a Better Path!</span>
        </button>
        <span className="text-[10px] text-slate-500 font-mono mt-3.5 uppercase tracking-widest font-bold">
          Replay paths to optimize {playerName}'s ledger scores!
        </span>
      </div>

    </div>
  );
}
