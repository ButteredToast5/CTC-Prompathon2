import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Coins, 
  CreditCard, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  UserX, 
  TrendingUp, 
  Heart, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Dices,
  Info
} from 'lucide-react';
import { GameStats, PathType } from '../types';
import FinancialTerm from './FinancialTerm';

interface NextDaysGameplayProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  activePath: PathType;
  onCompleteDays: (summary: string) => void;
  onFailEarly: (dayNum: number, summary: string) => void;
  playerName?: string;
}

export default function NextDaysGameplay({ 
  stats, 
  onUpdateStats, 
  activePath, 
  onCompleteDays,
  onFailEarly,
  playerName = 'Petr'
}: NextDaysGameplayProps) {
  const [currentDay, setCurrentDay] = useState<2 | 3>(2);
  const [selectedDay2Choice, setSelectedDay2Choice] = useState<string | null>(null);
  const [selectedDay3Choice, setSelectedDay3Choice] = useState<string | null>(null);
  const [dayReceipt, setDayReceipt] = useState<string>('');

  // Audio system helper
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

  // Helper to check safety conditions
  const checkSurvival = (updatedStats: GameStats, dayNum: number, transitionText: string) => {
    if (updatedStats.cash <= 0) {
      playBeep(180, 'sawtooth', 0.5);
      onFailEarly(dayNum, `${transitionText} ${playerName}'s cash plummeted to $0! Facing catastrophic insolvency, he could no longer afford basic semester materials or groceries.`);
      return false;
    }
    if (updatedStats.happiness < 15) {
      playBeep(150, 'sawtooth', 0.5);
      onFailEarly(dayNum, `${transitionText} ${playerName}'s stress levels triggered a severe depressive burnout (Mood dropped below 15%). The pressure of carrying extreme burdens caused him to freeze up entirely.`);
      return false;
    }
    return true;
  };

  // DAY 2 DECISIONS & HANDLERS
  const handleDay2Decision = (choiceId: 'A' | 'B' | 'C') => {
    let cashChange = 0;
    let debtChange = 0;
    let creditChange = 0;
    let happinessChange = 0;
    let receipt = '';

    playBeep(440, 'sine', 0.1);

    if (activePath === 'debit') {
      if (choiceId === 'A') { // Buy textbooks
        cashChange = -120;
        happinessChange = 15;
        receipt = "Chose the safe path and bought physical textbooks for $120 cash, protecting academic integrity and increasing happiness.";
      } else if (choiceId === 'B') { // SKetchy torrent text
        creditChange = -20;
        happinessChange = -5;
        receipt = "Downloaded a risky sketchy torrent textbook. Avoided paying cash, but was struck with a malware attack that compromised bank credentials (Credit Score -20, and minor stress).";
      } else { // Share and borrow incomplete manual
        cashChange = -30;
        happinessChange = -20;
        receipt = "Borrowed an incomplete manual for $30. Lost serious happiness points due to missing assignment pages, but saved cash.";
      }
    } else if (activePath === 'credit') {
      if (choiceId === 'A') { // Pay off billing chunk
        cashChange = -150;
        debtChange = -150;
        creditChange = 30;
        happinessChange = 5;
        receipt = "Allocated $150 cash immediately to lower credit card debt. Secured credit rating jumped up (+30) and lowered compounding pressure.";
      } else if (choiceId === 'B') { // Minimum payment of $20
        cashChange = -20;
        debtChange = 25; // APR compounds debt!
        creditChange = -10;
        happinessChange = -15;
        receipt = "Paid only the $20 minimum. The premium credit APR compounded the remaining debt balance, inducing a cycle of revolving card stress.";
      } else { // Defer bill
        debtChange = 35; // Latency penalties
        creditChange = -60;
        happinessChange = -25;
        receipt = "Ignored the payment deadline. Encountered a late payment fee penalty ($35) and heavily crashed the credit rating score (-60).";
      }
    } else if (activePath === 'gambling') {
      if (choiceId === 'A') { // "Doge-Turbo" slot buy-in
        cashChange = -100;
        // 10% chance to quadruple, 90% chance to lose: let's model a 90% loss to show high risk!
        const win = Math.random() < 0.12;
        if (win) {
          cashChange = 300; // Nets +300
          happinessChange = 30;
          receipt = "Speculated $100 on Doge-Turbo and got ridiculously lucky, netting a raw $300 profit! Do not expect this outcome normally.";
        } else {
          happinessChange = -25;
          receipt = "Speculated $100 on high-risk Doge-Turbo coins. All capital evaporated instantly, plummeting mood (-25).";
        }
      } else if (choiceId === 'B') { // Walk away
        creditChange = 15;
        happinessChange = -15;
        receipt = "Walked away from speculative hype. Saved his cash, built financial discipline (+15 Credit Score), but felt temporary Peer-FOMO (-15 Mood).";
      } else { // Buy cheap college food
        cashChange = -40;
        happinessChange = 10;
        receipt = "Allocated $40 to highly-necessary college diner food to sustain a balanced diet (+10 Happiness).";
      }
    } else if (activePath === 'investment') {
      if (choiceId === 'A') { // Panic sell investment
        // Liquidates holding at loss
        cashChange = -50; // Loss of value
        happinessChange = -20;
        receipt = "Panicked during the market fluctuation and sold holdings near low bounds, realizing a permanent $50 loss of hard-earned cash.";
      } else if (choiceId === 'B') { // Buy the dip (Double down)
        cashChange = -100;
        happinessChange = -5; // short term stress
        receipt = "Bought the dip! Invested another $100 cash. Stressed about budget limits today, but set up massive long-term potential.";
      } else { // Hold firm (Do nothing)
        receipt = "Held firm with discipline (HODL). Did not incur losses, proving that patience is essential in compounding market patterns.";
      }
    } else if (activePath === 'bnpl') {
      if (choiceId === 'A') { // Deduct split bill installment
        cashChange = -155; 
        receipt = "Paid his scheduled $155 BNPL installment automatically. Kept accounts clean, but depleted raw available checking savings.";
      } else if (choiceId === 'B') { // Ask private lender / peer
        cashChange = 50; // borrows
        debtChange = 80; // must repay $80 (extreme interest)
        happinessChange = -15;
        receipt = "Sought an informal loan from a private lender to handle bills. Saved current checking cash, but piled on high-interest social liabilities.";
      } else { // Heavy overtime shift
        cashChange = 110;
        happinessChange = -40;
        receipt = "Worked an exhausting 15-hour overnight shift. Added +$110 cash to checking, but induced extreme physical burnout and mood crash (-44).";
      }
    }

    setSelectedDay2Choice(choiceId);
    setDayReceipt(receipt);

    // Apply stats update inside component state dynamically and run check
    onUpdateStats(prev => {
      const nextStats = {
        cash: Math.max(0, prev.cash + cashChange),
        debt: Math.max(0, prev.debt + debtChange),
        creditScore: Math.max(300, Math.min(850, prev.creditScore + creditChange)),
        happiness: Math.max(0, Math.min(100, prev.happiness + happinessChange))
      };
      
      // Delay check slightly to let animation finish, or do it immediately
      return nextStats;
    });
  };

  const proceedToDay3 = () => {
    // Collect updated stats right now from active prop or updater logic
    playBeep(523, 'sine', 0.15);
    const survived = checkSurvival(stats, 2, `Day 2 choice outcome: ${dayReceipt}`);
    if (survived) {
      setCurrentDay(3);
      setDayReceipt('');
    }
  };

  // DAY 3 DECISIONS & HANDLERS
  const handleDay3Decision = (choiceId: 'A' | 'B' | 'C' | 'D') => {
    let cashChange = 0;
    let debtChange = 0;
    let creditChange = 0;
    let happinessChange = 0;
    let receipt = '';

    playBeep(587, 'sine', 0.12);

    if (choiceId === 'A') { // Pay with hard cash
      cashChange = -200;
      happinessChange = -10;
      receipt = "Paid the $200 emergency bill using raw liquid cash. Strained your pocket assets, but completely bypassed debt interest rates!";
    } else if (choiceId === 'B') { // Charge Credit Card (Requires card/credit approval)
      if (stats.creditScore >= 620) {
        debtChange = 200;
        creditChange = 15;
        happinessChange = -5;
        receipt = "Charged the $200 repair obligation to his credit limit. Score rose (+15) because he verified credit trust, but added $200 outstanding balance.";
      } else {
        // Declined!
        debtChange = 300; // Shark loan automatic
        creditChange = -40;
        happinessChange = -30;
        receipt = `CREDIT APPLICATION DECLINED! (Requires Credit Score 620+). With no other choice, ${playerName} resorted to alternative payday installment lending at a massive expense (+300 debt, -40 credit score).`;
      }
    } else if (choiceId === 'C') { // Sketchy Payday Loan shark
      debtChange = 350; // punising payback
      creditChange = -50;
      happinessChange = -20;
      receipt = `Chose a sketchy storefront Payday Loan. Got instant coverage, but saddled ${playerName} with an abusive $350 repayment and ruined his credit outlook.`;
    } else { // Ignore dental / health emergency
      happinessChange = -45;
      creditChange = -35;
      receipt = "Ignored the emergency crisis. Survived without paying money, but triggered extreme chronic stress (-45 Happiness) and minor collection impact.";
    }

    setSelectedDay3Choice(choiceId);
    setDayReceipt(receipt);

    onUpdateStats(prev => {
      const nextStats = {
        cash: Math.max(0, prev.cash + cashChange),
        debt: Math.max(0, prev.debt + debtChange),
        creditScore: Math.max(300, Math.min(850, prev.creditScore + creditChange)),
        happiness: Math.max(0, Math.min(100, prev.happiness + happinessChange))
      };
      return nextStats;
    });
  };

  const finishGameSuccessful = () => {
    playBeep(880, 'sine', 0.15);
    setTimeout(() => playBeep(1046, 'sine', 0.3), 100);
    const survived = checkSurvival(stats, 3, `Day 3 final emergency: ${dayReceipt}`);
    if (survived) {
      // Complete!
      const finalSummary = `Survived the complete 3-day dynamic trial!
      • Day 2 Check: ${dayReceipt || "Handled routine midweek challenges."}
      • Day 3 Climax: ${dayReceipt || "Resolved the ultimate financial crisis."}
      Excellent financial resilience. ${playerName} kept both checking reserves and mental stability balances intact over the course!`;
      onCompleteDays(finalSummary);
    }
  };

  // Helper functions to retrieve appropriate content based on current path
  const getDay2Details = () => {
    const defaultData = {
      title: 'Dilemma: Textbook Bill',
      icon: <BookOpen size={24} className="text-amber-400" />,
      desc: 'The college syllabus requires an official textbook bundle and access manual. Class begins tomorrow!',
      optA_title: 'Pay Book Bill Upfront ($120)',
      optA_desc: 'Pay cash instantly. Guarantees high coursework grades and stress safety.',
      optB_title: 'Sketchy Malware Torrent ($0)',
      optB_desc: 'Get it free from a warez hub. Risks laptop safety and digital credentials.',
      optC_title: 'Borrow Outdated Slides ($30)',
      optC_desc: 'Buy older notes. Saves cash but induces deep anxiety due to blank pages.'
    };

    switch (activePath) {
      case 'debit':
        return defaultData;
      case 'credit':
        return {
          title: 'Dilemma: Approaching Credit Deadline',
          icon: <CreditCard size={24} className="text-amber-400" />,
          desc: 'Your first credit card statement of the month has arrived! The full balance of $150 or the $20 minimum is due.',
          optA_title: 'Pay Full Statement Cash ($150)',
          optA_desc: 'Clear the balance completely. Zero APR compounding, rating builds instantly!',
          optB_title: 'Pay Minimum installment ($20)',
          optB_desc: 'Revolver trap! Cash stays safe, but debt remainder compounds on 29% APR.',
          optC_title: 'Ignore Deadline completely ($0)',
          optC_desc: 'Defer bill. Risk severe credit ratings fallout and direct penalty addition.'
        };
      case 'gambling':
        return {
          title: 'Dilemma: Speculative Coin Craze',
          icon: <Dices size={24} className="text-amber-400" />,
          desc: 'The chat rooms are flashing green. Doge-Turbo Coin is allegedly skyrocketing! Some students are flexing fast cash.',
          optA_title: 'All-In Speculate Option ($100)',
          optA_desc: 'Buy in during the hyper-craze. Potential windfall, but heavy loss probability.',
          optB_title: 'Decline and Walk Away ($0)',
          optB_desc: 'Enforce discipline. Suffer minor FOMO stress but preserve your bank wealth.',
          optC_title: 'Purchase Daily Diners Meal ($40)',
          optC_desc: 'Feed yourself properly. Healthy nutrition keeps stamina and mood stable.'
        };
      case 'investment':
        return {
          title: 'Dilemma: Volatility Market Dip',
          icon: <TrendingUp size={24} className="text-amber-400" />,
          desc: 'Tech indexes fluctuate downwards by 10%. Panic headlines spark student stock-forums panic lines.',
          optA_title: 'Panic Sell holdings now ($50 loss)',
          optA_desc: 'Liquidate current holdings under strain. Locks in losses but guarantees cash back.',
          optB_title: 'Buy the Dip! Invest ($100)',
          optB_desc: 'Dollar-cost average by buying extra index assets. Ties down liquidity cash.',
          optC_title: 'Hold Firm & HODL ($0)',
          optC_desc: 'Avoid action. Unemotional patience preserves your long-run compounding plans.'
        };
      case 'bnpl':
        return {
          title: 'Dilemma: Auto Draft installment Sweeping',
          icon: <Layers size={24} className="text-amber-400" />,
          desc: 'PAYDAY ARISES! The BNPL automatic split engine triggers the scheduled second installment ($155) directly from checking cache.',
          optA_title: 'Let draft pass cash ($155)',
          optA_desc: 'Charge checking instantly. Bypasses fees but leaves you with low pocket funds.',
          optB_title: 'Borrow via Private Lender ($50)',
          optB_desc: 'Get a private paycheck advance to balance cash, but carries high premium interest.',
          optC_title: 'Pull Overtime Overnight Shift',
          optC_desc: 'Earn +$110 extra checking cash. Induces heavy exhaustion fatigue and stress.'
        };
      default:
        return defaultData;
    }
  };

  const day2Data = getDay2Details();

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-6">
      
      {/* HEADER ROADMAP */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Calendar className="text-indigo-400" size={18} />
          <span className="text-slate-300 font-bold uppercase">PAYABLE DAYS ROADMAP</span>
        </div>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-500 line-through">Day 1</span>
          <span className={`px-2 py-0.5 rounded font-bold ${currentDay === 2 ? 'bg-indigo-650 text-white animate-pulse' : 'bg-slate-950 text-slate-500'}`}>Day 2</span>
          <span className={`px-2 py-0.5 rounded font-bold ${currentDay === 3 ? 'bg-rose-950 text-rose-400' : 'bg-slate-950 text-slate-600'}`}>Day 3 (Climax)</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* DAY 2: THE MIDWEEK SQUEEZE */}
        {currentDay === 2 && (
          <motion.div
            key="day2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 text-left"
          >
            <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-2xl p-6 space-y-5">
              <div className="flex items-center space-x-3 text-indigo-400">
                {day2Data.icon}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#818CF8] font-black">DAY 2 • THE MIDWEEK SQUEEZE</span>
                  <h2 className="text-xl font-display font-black text-white">{day2Data.title}</h2>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {day2Data.desc}
              </p>

              {/* Status Indicator Warning */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-2.5 text-xs text-slate-400">
                <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Difficulty Level Check: High.</strong> Daily life demands require smart cash reserves. Make an educated decision to survive!
                </span>
              </div>

              {/* Day 2 interactive Choice Column */}
              {!selectedDay2Choice ? (
                <div className="space-y-3 pt-2">
                  <button
                    id="day2-choice-A"
                    onClick={() => handleDay2Decision('A')}
                    className="w-full p-4 rounded-xl border border-slate-800 hover:border-indigo-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-indigo-400 text-sm">
                      Option A: {day2Data.optA_title}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {day2Data.optA_desc}
                    </p>
                  </button>

                  <button
                    id="day2-choice-B"
                    onClick={() => handleDay2Decision('B')}
                    className="w-full p-4 rounded-xl border border-slate-800 hover:border-amber-505 hover:border-amber-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 text-sm">
                      Option B: {day2Data.optB_title}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {day2Data.optB_desc}
                    </p>
                  </button>

                  <button
                    id="day2-choice-C"
                    onClick={() => handleDay2Decision('C')}
                    className="w-full p-4 rounded-xl border border-slate-800 hover:border-rose-505 hover:border-rose-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-rose-400 text-sm">
                      Option C: {day2Data.optC_title}
                    </div>
                    <p className="text-[11px] text-slate-400 text-slate-400">
                      {day2Data.optC_desc}
                    </p>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="p-5 bg-slate-950 rounded-xl border-2 border-emerald-500/30 text-xs text-slate-300 leading-relaxed font-sans relative">
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 font-mono text-[9px] uppercase font-bold rounded">
                      Decision Outcome Receipt
                    </span>
                    {dayReceipt}
                  </div>

                  <button
                    id="btn-day2-continue"
                    onClick={proceedToDay3}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-black tracking-wide cursor-pointer transition-transform duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>SURVIVED DAY 2! ONTO DAY 3</span>
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* DAY 3: THE pay DAY CLIMAX */}
        {currentDay === 3 && (
          <motion.div
            key="day3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 text-left"
          >
            <div className="bg-slate-900 border-2 border-rose-500/20 rounded-2xl p-6 space-y-5">
              <div className="flex items-center space-x-3 text-rose-455 text-rose-400">
                <Flame size={28} className="animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F87171] font-black">DAY 3 • THE ULTIMATE CLIMAX</span>
                  <h2 className="text-xl font-display font-black text-white">Emergency: Severe Dental Pain</h2>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Waking up on college exam day, {playerName} is struck down by severe, splitting wisdom tooth pain! He cannot concentrate and must visit a community clinic immediately.
              </p>

              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900 text-xs font-mono flex justify-between items-center text-slate-300">
                <span>🦷 clinic Medical Bill (Required):</span>
                <strong className="text-rose-400 text-sm">$200</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs text-slate-400 leading-normal">
                <h4 className="font-mono text-[9px] text-[#A5B4FC] uppercase tracking-wider font-semibold">Active Ledger Check</h4>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-1 border border-slate-900 rounded">
                    <div className="text-[8px] text-slate-500">CASH</div>
                    <div className="text-emerald-400 font-bold">${stats.cash}</div>
                  </div>
                  <div className="p-1 border border-slate-900 rounded">
                    <div className="text-[8px] text-slate-500">CREDIT</div>
                    <div className="text-indigo-400 font-bold">{stats.creditScore}</div>
                  </div>
                  <div className="p-1 border border-slate-900 rounded">
                    <div className="text-[8px] text-slate-500">ACTIVE DEBT</div>
                    <div className={`font-bold ${stats.debt > 0 ? 'text-rose-400' : 'text-slate-500'}`}>${stats.debt}</div>
                  </div>
                </div>
              </div>

              {/* Day 3 Interactive Choice Column */}
              {!selectedDay3Choice ? (
                <div className="space-y-3 pt-2">
                  <button
                    id="day3-choice-A"
                    onClick={() => handleDay3Decision('A')}
                    className="w-full p-4 rounded-xl border border-slate-850 hover:border-emerald-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-emerald-400 text-sm">
                      Option A: Pay Cash Immediate ($200)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Use checking or liquid reserves. Zero interest expense, but heavily drains present cash pool.
                    </p>
                  </button>

                  <button
                    id="day3-choice-B"
                    onClick={() => handleDay3Decision('B')}
                    className="w-full p-4 rounded-xl border border-slate-850 hover:border-indigo-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-indigo-400 text-sm">
                      Option B: Charge to Credit Card Card ($200 to Debt)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Requires <strong>Credit Score of 620+</strong>. Helps keep cash safe today, but carries card finance APR.
                    </p>
                  </button>

                  <button
                    id="day3-choice-C"
                    onClick={() => handleDay3Decision('C')}
                    className="w-full p-4 rounded-xl border border-slate-850 hover:border-amber-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 text-sm">
                      Option C: High-APR Store Payday Advance ($350 payback)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Storefront alternative. No credit score checks to utilize, but forces punitive $350 future payments.
                    </p>
                  </button>

                  <button
                    id="day3-choice-D"
                    onClick={() => handleDay3Decision('D')}
                    className="w-full p-4 rounded-xl border border-slate-850 hover:border-rose-500 hover:bg-slate-950/50 text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-rose-400 text-sm">
                      Option D: Defer Clinic Treatment ($0)
                    </div>
                    <p className="text-[11px] text-slate-400 font-normal">
                      Try to endure the pain. Saves immediate money, but causes crippling, extreme wellness crash (-45 Mood).
                    </p>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="p-5 bg-slate-950 rounded-xl border-2 border-emerald-500/30 text-xs text-slate-300 leading-relaxed font-sans relative">
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 font-mono text-[9px] uppercase font-bold rounded">
                      Ultimate Climax Decision Outcome
                    </span>
                    {dayReceipt}
                  </div>

                  <button
                    id="btn-day3-finish"
                    onClick={finishGameSuccessful}
                    className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-black tracking-wide text-sm rounded-xl cursor-pointer transition-all duration-200 shadow-md text-center"
                  >
                    ⌛ FINALIZE GAME COURSE & EVALUATE REPORT CARD
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
