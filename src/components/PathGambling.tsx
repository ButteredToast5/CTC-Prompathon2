import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, ArrowRight, RefreshCw, AlertCircle, ShoppingCart, Bomb, TrendingDown, Volume2 } from 'lucide-react';
import { GameStats } from '../types';

interface PathGamblingProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onFinish: (resultSummary: string) => void;
  playerName?: string;
}

type Step = 'store_entry' | 'scratch_game' | 'lose_result' | 'trap_victory' | 'gamble_over_broke';

export default function PathGambling({ stats, onUpdateStats, onFinish, playerName = 'Petr' }: PathGamblingProps) {
  const [step, setStep] = useState<Step>('store_entry');
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [ticketCost, setTicketCost] = useState<number>(0);

  // Scratch card / slot states
  const [spinning, setSpinning] = useState<boolean>(false);
  const [gridValues, setGridValues] = useState<string[]>([]);
  const [uncoveredIndices, setUncoveredIndices] = useState<number[]>([]);
  const [winStatus, setWinStatus] = useState<boolean>(false);

  // Synth sound help
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

  const handleTicketOption = (count: number) => {
    playBeep(330, 'sine', 0.1);
    setTicketCount(count);
    setTicketCost(count * 10);
    setStep('scratch_game');
    initializeGrid();
  };

  const initializeGrid = () => {
    setUncoveredIndices([]);
    // 99% chance to generate a losing grid, 1% chance for a small winning grid
    const isWinner = Math.random() < 0.05; // Give it 5% relative chance in simulation to keep it fun on retries but still illustrative
    setWinStatus(isWinner);

    const values = Array(9).fill('❌');
    if (isWinner) {
      // 3 matching 7s for win
      values[0] = '❼';
      values[3] = '❼';
      values[7] = '❼';
      // Rest are random losers
      values[1] = '☕'; values[2] = '💻'; values[4] = '💰'; values[5] = '🔥'; values[6] = '💔'; values[8] = '💀';
    } else {
      // Pure randomness, no 3 matching
      const pool = ['🍒', '🍋', '🔔', '💻', '💸', '💔', '💀', '☕', '🔥'];
      for (let i = 0; i < 9; i++) {
        values[i] = pool[Math.floor(Math.random() * pool.length)];
      }
    }
    setGridValues(values);
  };

  const handleScratchCell = (index: number) => {
    if (uncoveredIndices.includes(index)) return;
    playBeep(600, 'triangle', 0.05);
    setUncoveredIndices(prev => [...prev, index]);

    // Check if fully uncovered
    if (uncoveredIndices.length + 1 === 9) {
      evaluateScratchResult();
    }
  };

  const evaluateScratchResult = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      if (winStatus) {
        playBeep(880, 'sine', 0.15);
        setTimeout(() => playBeep(1320, 'sine', 0.3), 120);
        setStep('trap_victory');
      } else {
        playBeep(120, 'sawtooth', 0.4);
        setStep('lose_result');
      }
    }, 1200);
  };

  const handleDeclineMoreSpin = () => {
    playBeep(440, 'sine', 0.12);
    // Escape with a small win: Net Worth drops by cost - $20 win
    const loss = ticketCost - 20;
    onUpdateStats(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - loss),
      happiness: Math.min(100, prev.happiness + 5)
    }));

    onFinish(`Bought ${ticketCount} lottery tickets for $${ticketCost}. Uncovered a match and won $20! Smartly walked away before falling into the recursive psychological 'Double or Nothing' loop. Escaped with minimal total losses.`);
  };

  const handleGambleTrapAgain = () => {
    onUpdateStats(p => ({ ...p, happiness: Math.max(10, p.happiness - 20) }));
    playBeep(150, 'sawtooth', 0.5);
    // Double and lose everything!
    setWinStatus(false);
    initializeGrid();
    setStep('scratch_game');
  };

  const handleAcceptBrokeResult = () => {
    playBeep(110, 'sawtooth', 0.5);
    onUpdateStats(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - ticketCost),
      happiness: Math.max(5, prev.happiness - 50)
    }));

    onFinish(`Fell deeply into the convenience store Lottery trap. Expended $${ticketCost} of hard earned barista savings on worthless paper scratchers. Ending cash balances dropped down, leaving him staring at a trash can of worthless lottery papers with $0 left for grocery bills or bus fare.`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* SECTION 1: ENTERING CONVENIENCE STORE */}
      {step === 'store_entry' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-3 text-rose-450">
            <Ticket size={28} className="animate-pulse" />
            <h2 className="text-lg font-bold">Scene 1: The Lure of $10 Million</h2>
          </div>

          <p className="text-slate-300 text-base md:text-lg tracking-tight font-medium leading-relaxed">
            Walking past the local neon-lit <strong>Lucky Express Store</strong>, {playerName} sees a bright, moving signs in the storefront:
          </p>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 rounded-2xl border border-indigo-500/30 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-rose-500/10 rounded-full filter blur-xl animate-pulse" />
            <span className="font-mono text-indigo-400 text-xs tracking-widest font-bold">LUCKY EXPRESS • STATE LOTTERY</span>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-250 to-orange-400 font-black text-3xl tracking-tight">
              👑 $10,000,000 JACKPOT!
            </h3>
            <p className="text-slate-200 text-xs">
              "You can't win if you don't play. Mega Scratch-Off cards only <strong>$10 each</strong>!"
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-xs italic text-slate-400 text-center">
            "Clerk Manny says: 'People win every single day! Just bought a new truck using my scratch winnings. Play a few cards kid, you look like a lucky soul!'"
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <button
              id="gambling-option-one"
              onClick={() => handleTicketOption(1)}
              className="p-4 rounded-xl border-2 border-slate-800 hover:border-amber-500 hover:bg-slate-850/40 text-left transition-all cursor-pointer group space-y-1"
            >
              <div className="font-black text-slate-100 group-hover:text-amber-400 text-lg md:text-xl">
                🎟️ Buy 1 Ticket ($10)
              </div>
              <p className="text-xs text-slate-300">
                Just test the waters. Keep $490 safely reserved for checking. Minimal risk, minor thrill.
              </p>
            </button>

            <button
              id="gambling-option-allin"
              onClick={() => handleTicketOption(50)}
              className="p-4 rounded-xl border-2 border-rose-500/30 hover:border-rose-500 hover:bg-rose-950/20 text-left transition-all cursor-pointer group space-y-1 bg-rose-950/5"
            >
              <div className="font-black text-slate-100 group-hover:text-rose-400 text-lg md:text-xl flex items-center justify-between">
                <span>🔥 Go ALL IN! (50 Tickets for $500)</span>
                <span className="text-[9px] bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded uppercase font-mono font-black">PSYCHOTIC</span>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed">
                Spend his entire first paycheck instantly. 50 times the likelihood to hit the big millions!
              </p>
            </button>
          </div>
        </motion.div>
      )}

      {/* SECTION 2: INTERACTIVE SCRATCH CARD MINI-GAME */}
      {step === 'scratch_game' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6"
        >
          <div className="space-y-1 text-left">
            <span className="font-mono text-amber-500 font-bold uppercase tracking-wider text-[11px]">Mega Scratch-Off Ticket</span>
            <h2 className="text-base font-bold text-white">Click any compartment below to Scratch & Reveal!</h2>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 relative">
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {gridValues.map((val, idx) => {
                const isUncovered = uncoveredIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    id={`scratch-cell-${idx}`}
                    onClick={() => handleScratchCell(idx)}
                    disabled={spinning}
                    className={`h-20 w-full rounded-xl flex items-center justify-center font-bold text-base transition-all ${
                      isUncovered 
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 text-2xl' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 border border-amber-300 text-slate-950 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 hover:rotate-1'
                    }`}
                  >
                    {isUncovered ? val : '🪙'}
                  </button>
                );
              })}
            </div>

            {spinning && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <RefreshCw size={24} className="text-amber-500 animate-spin" />
                <span className="font-mono text-slate-400 text-xs">Registering combinations with State Ledger...</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 flex justify-between items-center font-mono">
            <span>SCRATCHED: {uncoveredIndices.length} / 9 FIELDS</span>
            <span>COST: -${ticketCost}</span>
          </div>
        </motion.div>
      )}

      {/* SECTION 3: SCENARIO A - COMPLETE LOSS */}
      {step === 'lose_result' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6"
        >
          <div className="inline-flex p-4 bg-rose-950/40 text-rose-500 border border-rose-900 rounded-full">
            <Bomb size={32} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-rose-500 font-bold uppercase tracking-widest text-[10px]">REVEAL OUTCOME</span>
            <h2 className="text-2xl font-black text-white">LOSER. NOTHING MATCHED.</h2>
          </div>

          <div className="max-w-md mx-auto bg-slate-955 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
            <p className="text-xs text-slate-350 leading-relaxed">
              Every single ticket was a dud. Staring down, {playerName} sees raw empty spaces in the scratch boxes. The trash can is filled with worthless curled silver-grey paper.
            </p>
            <div className="p-3 bg-red-950/20 border border-red-900/50 rounded flex gap-2.5 text-[11px] text-rose-350 leading-relaxed">
              <TrendingDown className="shrink-0 text-rose-500 mt-0.5" size={14} />
              <span>
                <strong>Damage:</strong> Lost a total of <strong className="font-mono text-white">${ticketCost}</strong> cash. He now has no savings left and cannot even cover simple bus fare or dinner. He's broke and stressed.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-gambling-broke"
              onClick={handleAcceptBrokeResult}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs tracking-wide cursor-pointer transition-colors uppercase"
            >
              Face the Brutal Truth 🪦
            </button>
          </div>
        </motion.div>
      )}

      {/* SECTION 4: SCENARIO B - PSYCHOLOGICAL WIN TRAP */}
      {step === 'trap_victory' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6"
        >
          <div className="inline-flex p-4 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-full animate-bounce">
            <Volume2 size={32} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-emerald-400 font-bold uppercase tracking-widest text-[10px]">REVEAL OUTCOME</span>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">🚨 WINNER! +$20 PAYOUT</h2>
          </div>

          <div className="max-w-md mx-auto bg-slate-955 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
            <p className="text-xs text-slate-350 leading-relaxed">
              {playerName}'s eyes expand. A MATCH OF SEVENS! A massive rush of dopamine hits his amygdala. He doubled his $10 ticket into a $20 prize payout!
            </p>
            
            <p className="text-xs text-amber-500 italic font-medium leading-relaxed">
              "We doubled our money! Kid, I told you you were a golden lightning soul! Payout's right here... But check this new 'Super Diamond' ticket. Massive $50,000 top jackpot. Let's spin it back right now to strike it huge!"
            </p>
          </div>

          {/* Psychological Choice Gate */}
          <div className="grid grid-cols-1 gap-3">
            <button
              id="btn-gamble-again-trap"
              onClick={handleGambleTrapAgain}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-lg animate-pulse"
            >
              🚀 Double or Nothing! Gamble the $20
            </button>
            <button
              id="btn-gamble-walk-away"
              onClick={handleDeclineMoreSpin}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
            >
              🛑 Decline the Clerk • Take the $20 Win and Walk Away
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
