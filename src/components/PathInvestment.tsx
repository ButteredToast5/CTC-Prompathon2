import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Sparkles, BookOpen, Clock, ChevronRight, Play, Coins, AlertCircle, RefreshCw } from 'lucide-react';
import { GameStats } from '../types';
import { CRYPTO_TICKS } from '../data';
import FinancialTerm from './FinancialTerm';

interface PathInvestmentProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onFinish: (resultSummary: string) => void;
  playerName?: string;
}

type Step = 'study_room' | 'crypto_growth' | 'crypto_crash' | 'index_simulator';

export default function PathInvestment({ stats, onUpdateStats, onFinish, playerName = 'Petr' }: PathInvestmentProps) {
  const [step, setStep] = useState<Step>('study_room');

  // Crypto simulation state
  const [cryptoSec, setCryptoSec] = useState<number>(0);
  const [cryptoActive, setCryptoActive] = useState<boolean>(false);
  const [hasRugPulled, setHasRugPulled] = useState<boolean>(false);
  const [userTriedCashout, setUserTriedCashout] = useState<boolean>(false);
  const [cryptoLog, setCryptoLog] = useState<string[]>([]);

  // Index fund simulation state
  const [monthlyContribution, setMonthlyContribution] = useState<number>(50);
  const [simYears, setSimYears] = useState<number>(20);

  // sound trigger help
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

  const handleChoice = (option: 'crypto' | 'index') => {
    playBeep(440, 'sine', 0.12);
    if (option === 'crypto') {
      setStep('crypto_growth');
      startCryptoTicker();
    } else {
      setStep('index_simulator');
    }
  };

  // CRYPTO RUN TIMELINE
  const startCryptoTicker = () => {
    setCryptoSec(0);
    setCryptoActive(true);
    setHasRugPulled(false);
    setUserTriedCashout(false);
    setCryptoLog(['🔌 Connecting to exchange liquidity...']);
  };

  useEffect(() => {
    let interval: any;
    if (cryptoActive && cryptoSec < CRYPTO_TICKS.length) {
      interval = setInterval(() => {
        setCryptoSec(prev => {
          let nextSec = prev + 1;
          const tick = CRYPTO_TICKS[nextSec];
          if (tick) {
            playBeep(500 + tick.price * 0.1, 'sine', 0.08);
            setCryptoLog(log => [...log, `📈 ${tick.label}: Coin Price $${tick.price}`]);
          }
          if (nextSec >= 9) {
            // Rug pulled at final index
            setCryptoActive(false);
            setHasRugPulled(true);
            playBeep(100, 'sawtooth', 0.5);
          }
          return nextSec;
        });
      }, 750);
    }
    return () => clearInterval(interval);
  }, [cryptoActive, cryptoSec]);

  const handleCashoutCrypto = () => {
    setUserTriedCashout(true);
    setCryptoActive(false);
    // Even if they try to cash out, simulate withdrawal suspension/exchange freeze (the typical crypto trap!)
    playBeep(200, 'sawtooth', 0.4);
    setCryptoLog(prev => [...prev, '🚨 ERROR: Withdrawal pipeline locked. Insufficient exchange liquidity!', '😱 RUG PULL CRITICAL SIGNAL ACQUIRED...']);
    setTimeout(() => {
      setHasRugPulled(true);
    }, 1000);
  };

  const finishCryptoPath = () => {
    playBeep(200, 'sawtooth', 0.5);
    onUpdateStats(prev => ({
      ...prev,
      cash: 0,
      happiness: Math.max(10, prev.happiness - 35)
    }));

    onFinish(`Pushed the entire first week wages of $500 into Doge-Rocket-Inu Shonk Coin. Experienced immediate dopamine rush as prices skyrocketed artificially to $3,200, but learned a critical lesson when the founders 'rug pulled' the supply. The coin crashed to zero instantly, erasing his capital.`);
  };

  // INDEX FUND CALCULATION
  const getIndexGrowth = () => {
    let yearList = [];
    const annualRate = 0.08; // 8% avg index fund returns
    let balance = 500; // original lump sum

    for (let yr = 1; yr <= simYears; yr++) {
      // compound annual returns
      balance = balance * (1 + annualRate) + (monthlyContribution * 12);
      yearList.push({
        year: yr,
        total: Math.round(balance),
        contributed: Math.round(500 + (monthlyContribution * 12 * yr))
      });
    }
    return yearList;
  };

  const progressData = getIndexGrowth();
  const finalIndexBal = progressData[progressData.length - 1]?.total || 500;
  const totalContributed = progressData[progressData.length - 1]?.contributed || 500;

  const finishIndexFundPath = () => {
    playBeep(880, 'sine', 0.25);
    onUpdateStats(prev => ({
      ...prev,
      cash: finalIndexBal,
      creditScore: Math.min(850, prev.creditScore + 20),
      happiness: Math.min(100, prev.happiness + 20)
    }));

    onFinish(`Sought structured advice from sister Maya and invested $500 in a safe, low-fee diversified Index Fund. Set up a regular monthly contribution of $${monthlyContribution}. After compounding over ${simYears} years, his wealth expanded to a staggering $${finalIndexBal} with robust structural consistency.`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. STUDY ROOM ENTRY */}
      {step === 'study_room' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-3 text-cyan-400">
            <BookOpen size={28} />
            <h2 className="text-lg font-bold">Scene 1: Backed by Science</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {playerName} pulls a chair next to his sister **Maya**, an economics Ph.D student. She sits surrounded by graphs and thick finance volumes.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs italic text-slate-400 relative">
            <span className="absolute -top-2 left-4 px-2 py-0.5 bg-slate-800 text-indigo-400 font-mono text-[9px] rounded uppercase font-semibold">Sister Maya</span>
            "Hey buddy! Proud of your paycheck! If you keep cash in a drawer, inflation eats 3% of your spending power every single year. You need your money working for you through <FinancialTerm term="compound">index compounding</FinancialTerm>, not sitting idle. Just avoid speculative hype circles."
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              id="invest-option-index"
              onClick={() => handleChoice('index')}
              className="p-4 rounded-xl border-2 border-emerald-500/50 hover:border-emerald-500 hover:bg-slate-850/40 text-left transition-all cursor-pointer group space-y-1.5 bg-emerald-950/20"
            >
              <div className="font-black text-slate-100 group-hover:text-emerald-400 text-lg md:text-xl flex justify-between items-center">
                <span>📁 Diversified <FinancialTerm term="index_fund">Index Fund</FinancialTerm></span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded font-black">SAFE GROWTH</span>
              </div>
              <p className="text-xs text-slate-300">
                Put $500 in low-fee <FinancialTerm term="index_fund">Index Funds</FinancialTerm> mirroring the broader economic markets. Compiles stable 8-10% average annual composite interest.
              </p>
            </button>

            <button
              id="invest-option-crypto"
              onClick={() => handleChoice('crypto')}
              className="p-4 rounded-xl border-2 border-rose-500/30 hover:border-rose-500 hover:bg-rose-950/20 text-left transition-all cursor-pointer group space-y-1.5 bg-rose-950/5"
            >
              <div className="font-black text-slate-100 group-hover:text-rose-450 text-lg md:text-xl flex justify-between items-center">
                <span>🚀 "Doge-Rocket-Inu" Meme Token</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded font-black">SPECULATIVE TRAP</span>
              </div>
              <p className="text-xs text-slate-300">
                Swap the $500 for a trendy internet cryptocurrency coin on hot advice from a high school friend. Fast results promised!
              </p>
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. CRYPTO ticker SIMULATOR */}
      {step === 'crypto_growth' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-rose-450">
              <Coins size={22} className="animate-spin-slow" />
              <h2 className="text-base font-bold">Live Trading Simulator</h2>
            </div>
            <span className="text-green-400 text-xs font-mono font-bold uppercase animate-pulse">● LIVE TICKER</span>
          </div>

          {/* Glowing Retro Display Screen */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 font-mono text-center space-y-5 relative overflow-hidden h-60 flex flex-col justify-between">
            <div className="absolute top-2 left-2 text-[9px] text-slate-500 uppercase tracking-widest">DOGE-ROCK-INU (DRI)</div>
            
            {/* Asset Price representation */}
            <div className="space-y-1 mt-6">
              <span className="text-[11px] text-slate-400">ESTIMATED PORTFOLIO VALUE:</span>
              <h1 className="text-4xl font-extrabold text-green-400 flex justify-center items-center">
                ${CRYPTO_TICKS[Math.min(cryptoSec, CRYPTO_TICKS.length - 1)].price}
              </h1>
              <span className="text-[10px] text-emerald-300 bg-emerald-950/50 border border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                +{Math.round(((CRYPTO_TICKS[Math.min(cryptoSec, CRYPTO_TICKS.length - 1)].price - 500) / 500) * 100)}% ROI
              </span>
            </div>

            {/* Exchange terminal operations list */}
            <div className="h-16 overflow-y-auto text-[9px] text-slate-400 space-y-0.5 text-left border-t border-slate-900 pt-2">
              {cryptoLog.slice(-3).map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {cryptoActive ? (
              <button
                id="btn-crypto-cashout"
                onClick={handleCashoutCrypto}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
              >
                💰 CASH OUT TODAY & SELL OUT INDICES
              </button>
            ) : (
              hasRugPulled && (
                <button
                  id="btn-crypto-fail"
                  onClick={() => setStep('crypto_crash')}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  Unveil Market Resolution
                </button>
              )
            )}
            <p className="text-[11px] text-slate-500 text-center uppercase font-mono tracking-widest leading-loose">
              {cryptoActive ? '💡 SECONDS FLUSHING WILDLY • SELL OR HODL!' : '❌ RETRIEVAL HALTED'}
            </p>
          </div>
        </motion.div>
      )}

      {/* 3. CRYPTO CRASH ERROR */}
      {step === 'crypto_crash' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6"
        >
          <div className="inline-flex p-4 bg-rose-950/40 text-rose-500 border border-rose-900 rounded-full animate-pulse">
            <AlertCircle size={32} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-rose-500 font-bold uppercase tracking-widest text-[10px]">Exchange Incident Report</span>
            <h1 className="text-2xl font-black text-white">Rug Pulled! DRI Capped to $2</h1>
          </div>

          <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
            Exactly 6.3 seconds later, the major liquidity creators and founders sold out all their tokens at peak pricing. DRI crashed in a vertical red line. The swap app has frozen withdrawals. {playerName}’s balance is effectively gone.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 text-xs font-mono max-w-sm mx-auto space-y-1 text-left text-slate-500">
            <div className="flex justify-between">
              <span>Original Capital:</span>
              <span className="text-white">$500</span>
            </div>
            <div className="flex justify-between">
              <span>Current DRI Market Value:</span>
              <span className="text-rose-500">$2 (Dead Asset)</span>
            </div>
          </div>

          <button
            id="btn-crypto-finish"
            onClick={finishCryptoPath}
            className="w-full max-w-xs py-3.5 bg-slate-105 hover:bg-slate-200 text-slate-950 font-bold rounded-xl text-xs tracking-wide cursor-pointer transition-colors"
          >
            Acknowledge Speculation Pitfalls ⌛
          </button>
        </motion.div>
      )}

      {/* 4. INDEX SIMULATION BOARD */}
      {step === 'index_simulator' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-2 text-emerald-400">
            <Clock size={24} />
            <h2 className="text-base font-bold">Interactive Index Compound Simulator</h2>
          </div>

          <p className="text-slate-300 text-xs leading-normal">
            {playerName} feeds his initial $500 lump paycheck into the world index, expanding steadily at an <strong>8% average annual return</strong> compounded. Adjust the timeline and monthly allocations below.
          </p>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
            {/* Interactive sliders */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono pb-1 text-slate-400">
                  <span>MONTHLY SAVINGS RECURRENCE:</span>
                  <strong className="text-emerald-400">${monthlyContribution}/mo</strong>
                </div>
                <input
                  id="slider-monthly-contrib"
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={monthlyContribution}
                  onChange={(e) => {
                    playBeep(350 + parseInt(e.target.value), 'sine', 0.04);
                    setMonthlyContribution(parseInt(e.target.value));
                  }}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono pb-1 text-slate-400">
                  <span>TIME TIMELINE COMPASS (YEARS):</span>
                  <strong className="text-indigo-400">{simYears} years</strong>
                </div>
                <input
                  id="slider-sim-years"
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={simYears}
                  onChange={(e) => {
                    playBeep(250 + parseInt(e.target.value) * 10, 'sine', 0.04);
                    setSimYears(parseInt(e.target.value));
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Simulated compounding curve summary */}
            <div className="border-t border-slate-900 pt-3 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 border border-slate-900 rounded bg-slate-900/30">
                <span className="text-[9px] text-slate-500 uppercase font-mono">Total Capital Contributed</span>
                <div className="font-mono font-bold text-slate-300 text-sm">${totalContributed}</div>
              </div>
              <div className="p-2 border border-emerald-900/30 rounded bg-emerald-950/5">
                <span className="text-[9px] text-emerald-500 uppercase font-mono">COMPOUND INTEREST ACCRUAL</span>
                <div className="font-mono font-bold text-emerald-400 text-sm">${finalIndexBal}</div>
              </div>
            </div>

            {/* S&P 500 comparison indicator display */}
            <div className="text-[10px] text-slate-400 leading-relaxed text-center italic bg-slate-900/30 p-2 border border-slate-900 rounded">
              "Through the magic of <strong><FinancialTerm term="compound">Compound Interest</FinancialTerm></strong>, {playerName}'s money doesn't just grow. His earned interest begins generating its own interest, fueling an exponential compounding curving line!"
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-index-finish"
              onClick={finishIndexFundPath}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-transform cursor-pointer text-center tracking-wide"
            >
              Deduct Capital & Secure Index Portfolio ⌛
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
