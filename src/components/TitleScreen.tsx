import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, ArrowRight, Dices, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onLoadSave: () => void;
  playerName?: string;
}

export default function TitleScreen({ onStart, onLoadSave, playerName = 'Petr' }: TitleScreenProps) {
  const [hasSave, setHasSave] = useState<boolean>(false);
  const [saveStats, setSaveStats] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cash_course_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.stats) {
          setHasSave(true);
          setSaveStats(parsed.stats);
        }
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  // Simple synthesiser sound on hover/click to elevate arcade feel
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if browser blocked
    }
  };

  const handleClick = () => {
    playBeep(440, 'triangle', 0.15);
    setTimeout(() => playBeep(554, 'triangle', 0.15), 100);
    setTimeout(() => playBeep(659, 'triangle', 0.3), 200);
    onStart();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg mx-auto z-10 flex flex-col justify-center items-center flex-grow pt-12 select-none">
        {/* Arcade Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-1.5 rounded-full bg-indigo-555/10 bg-indigo-500/10 border-2 border-indigo-400/20 text-indigo-400 text-xs font-mono uppercase tracking-[0.2em] mb-8 shadow-xs"
        >
          🕹️ INTERACTIVE LIFE SIMULATION
        </motion.div>

        {/* Main Title Styling */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 100 }}
            className="text-emerald-400 font-mono text-xs tracking-[0.3em] font-black uppercase"
          >
            CASH COURSE
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 100 }}
            className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-300 tracking-tighter shadow-sm"
          >
            {playerName}'s First Paycheck
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed"
          >
            {playerName} holds $500 in hard-earned cash. Every choice opens a new gateway: credit traps, savings benchmarks, gamble loops, or long-term growth.
          </motion.p>
        </div>

        {/* Dynamic Arcade Grid representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-md mt-10 p-4 bg-slate-800/50 border-4 border-slate-700 rounded-3xl backdrop-blur-md"
        >
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-b-4 border-slate-950 text-center text-xs space-y-1">
            <Landmark className="text-emerald-400" size={20} />
            <span className="font-bold text-slate-300">Modern Banking</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-b-4 border-slate-950 text-center text-xs space-y-1">
            <CreditCard className="text-indigo-400" size={20} />
            <span className="font-bold text-slate-300">Credit & Debt</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-b-4 border-slate-950 text-center text-xs space-y-1">
            <Dices className="text-rose-400" size={20} />
            <span className="font-bold text-slate-300">Lotto Spiller</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-b-4 border-slate-950 text-center text-xs space-y-1">
            <TrendingUp className="text-cyan-400" size={20} />
            <span className="font-bold text-slate-300">Speculative Crypto</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-b-4 border-slate-950 text-center text-xs space-y-1">
            <ShoppingBag className="text-amber-400" size={20} />
            <span className="font-bold text-slate-300">Buy Now, Pay Later</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border-2 border-emerald-500/20 bg-emerald-950/20 text-center text-xs space-y-1 col-span-2 md:col-span-1 border-b-4 border-emerald-950">
            <span className="font-mono font-black text-emerald-400">$500</span>
            <span className="text-slate-400 text-[10px] uppercase font-mono font-bold">Paycheck Start</span>
          </div>
        </motion.div>

        {/* Buttons wrapper */}
        <div className="flex flex-col items-center w-full">
          {/* Start Button */}
          <motion.button
            id="btn-start-game"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => playBeep(330, 'sine', 0.05)}
            onClick={handleClick}
            className="mt-10 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-lg rounded-2xl tracking-wide shadow-lg shadow-emerald-500/20 border-b-4 border-emerald-800 transition-all cursor-pointer flex items-center space-x-3 active:border-b-0 active:translate-y-[4px]"
          >
            <span>START PAYDAY!</span>
            <ArrowRight size={20} />
          </motion.button>

          {/* Load Game Button if Save Exists */}
          {hasSave && saveStats && (
            <motion.button
              id="btn-load-game"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playBeep(440, 'triangle', 0.15);
                onLoadSave();
              }}
              className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border-2 border-emerald-500/30 font-mono text-xs rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow"
            >
              <span>💾 LOAD SAVED SESSION (Cash: ${saveStats.cash} • Credit: {saveStats.creditScore})</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="z-10 text-center text-slate-500 text-[11px] font-mono mt-8 uppercase tracking-widest">
        Designed for High School & College Students • Click to Learn & Explore Paths
      </div>
    </div>
  );
}
