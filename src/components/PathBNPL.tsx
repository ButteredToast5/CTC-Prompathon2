import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, HelpCircle, Flame, Calendar, AlertOctagon, Landmark, XCircle } from 'lucide-react';
import { GameStats } from '../types';
import FinancialTerm from './FinancialTerm';

interface PathBNPLProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onFinish: (resultSummary: string) => void;
  playerName?: string;
}

type Step = 'storefront' | 'checkout' | 'month_collision';

interface EcomItem {
  id: string;
  name: string;
  price: number;
  bnplPrice: number;
  icon: string;
  selected: boolean;
}

export default function PathBNPL({ stats, onUpdateStats, onFinish, playerName = 'Petr' }: PathBNPLProps) {
  const [step, setStep] = useState<Step>('storefront');

  // Interactive items selected
  const [items, setItems] = useState<EcomItem[]>([
    { id: 'item_jacket', name: 'Alpha Brand Leather Jacket', price: 100, bnplPrice: 25, icon: '🧥', selected: true },
    { id: 'item_headphones', name: 'Noise-Cancelling Sleek Pro Headphones', price: 160, bnplPrice: 40, icon: '🎧', selected: true },
    { id: 'item_chair', name: 'Cosmic Ergonomic Lumbar Gaming Chair', price: 120, bnplPrice: 30, icon: '💺', selected: true }
  ]);

  // sound help
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

  const toggleItemSelection = (id: string) => {
    playBeep(400, 'sine', 0.05);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  const selectedItems = items.filter(item => item.selected);
  const totalBill = selectedItems.reduce((a, b) => a + b.price, 0);
  const totalBnplToday = selectedItems.reduce((a, b) => a + b.bnplPrice, 0);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleEcomCheckout = () => {
    if (selectedItems.length === 0) {
      setCheckoutError("Please select at least one item to purchase!");
      setTimeout(() => setCheckoutError(null), 3000);
      return;
    }
    playBeep(659, 'sine', 0.12);
    setStep('checkout');
  };

  const handleAgreeBNPL = () => {
    playBeep(880, 'sine', 0.15);
    // pay only today's BNPL installment of totalBnplToday
    onUpdateStats(prev => ({
      ...prev,
      cash: prev.cash - totalBnplToday,
      happiness: Math.min(100, prev.happiness + 20) // Petr feels immediate shopping happiness dopamine spike!
    }));
    setStep('month_collision');
  };

  const handleResolveCollision = () => {
    playBeep(120, 'sawtooth', 0.5);

    // Month collision is calculated as:
    // Petr's remaining paycheck was: $500 - totalBnplToday
    // e.g. for all three: today paid $95, remaining cash is $405.
    // Next month, he gets hit with monthly BNPL repayments:
    // Plus a streaming subscription ($15) and a phone bill ($45).
    // Let's list those out:
    // Repayments total is (totalBnplToday: $95) * 3 remaining months. So $95 repayment + $15 streaming + $45 phone = $155 total hitting.
    // Wait, let's make the scenario dramatic:
    // Assume his checking balance dropped a bit because of general expenses, and has only $100 left.
    // On Friday morning, all three BNPL payments ($95 total) + a gym membership ($35) + streaming ($15) hit his account at once.
    // Total is $145, but he has $100 checking.
    // He overdrafts by $45, but because they are separate transactions, the bank charges separate $35 overdraft fees!
    // 3 separate transactions failed: -$105 total fees!
    // This perfectly demonstrates the BNPL hidden disaster of multiple micro-repayments.
    
    const fees = 105;
    const itemsLoss = totalBill - totalBnplToday; // the rest of the debt Petr owes
    
    onUpdateStats(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - 100), // empty out his general current cash
      debt: prev.debt + itemsLoss + fees,
      creditScore: Math.max(300, prev.creditScore - 90),
      happiness: Math.max(5, prev.happiness - 40)
    }));

    onFinish(`Fell for the 'Buy Now, Pay Later' (BNPL) trap by stacking 3 separate split-repayments. Staggering monthly automatic transactions hit his checking account simultaneously next month, overdrafting his account. Face three separate $35 overdraft fees ($105 total penalty), driving his total liabilities to negative.`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. ECOMMERCE STOREFRONT */}
      {step === 'storefront' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-3 text-amber-500">
            <ShoppingBag size={28} />
            <h2 className="text-lg font-bold">Scene 1: {playerName} Browses Online</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Relaxing in his bedroom with your paycheck cash safely stashed, {playerName} goes online to buy clothes and gear he has been eyeing.
          </p>

          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Shopping Cart Checkout Products:</h4>
            
            {items.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  item.selected 
                    ? 'border-amber-500/50 bg-amber-950/10 text-slate-100' 
                    : 'border-slate-800 text-slate-400 bg-slate-950/20'
                }`}
              >
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h5 className="font-bold">{item.name}</h5>
                    <span className="text-[11px] font-mono text-slate-500">Regular: ${item.price}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs block font-bold text-amber-400">4 easy payments of</span>
                  <strong className="text-sm font-black text-amber-400">${item.bnplPrice}/mo</strong>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {checkoutError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-rose-350 text-xs text-center font-bold"
              >
                ⚠️ {checkoutError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Stats */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">TOTAL CART UPFRONT:</span>
              <span className="text-stone-300 text-sm line-through">${totalBill}</span>
            </div>
            <div className="flex justify-between font-mono font-black text-lg md:text-xl text-amber-500 mt-2">
              <span className="uppercase tracking-widest text-xs self-center">BNPL today:</span>
              <span className="text-amber-400 font-black">${totalBnplToday} today</span>
            </div>
          </div>

          <button
            id="btn-ecom-checkout"
            onClick={handleEcomCheckout}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-base transition-transform cursor-pointer text-center shadow-lg"
          >
            🛒 Proceed to Checkout Panel
          </button>
        </motion.div>
      )}

      {/* 2. THE CHECKOUT MODAL WINDOW TRAP */}
      {step === 'checkout' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6"
        >
          <div className="flex items-center space-x-2.5 text-amber-500 border-b border-slate-800 pb-3">
            <Flame size={24} className="animate-pulse" />
            <h2 className="text-base font-bold">Checkout Integration Promo</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {playerName} clicks purchase. An aggressive checkout wizard overrides the standard credit card options:
          </p>

          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-5 rounded-2xl text-center space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-500 font-black">💳 Split-Pay Premium <FinancialTerm term="bnpl">BNPL</FinancialTerm></h3>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-400">
              Only ${totalBnplToday} Today!
            </h2>
            <p className="text-slate-400 text-xs text-justify">
              "Why pay <strong>${totalBill}</strong> up front when you can split it into 4 small monthly drafts? No hidden credit checks. Zero impact on <FinancialTerm term="credit_score">credit score</FinancialTerm>. Live comfortable. Buy everything today!"
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[11px] text-slate-400 flex items-start gap-2.5 leading-relaxed">
            <HelpCircle className="text-amber-500 mt-0.5 shrink-0" size={16} />
            <span>
              <strong>The Trap:</strong> <FinancialTerm term="bnpl">BNPL plans</FinancialTerm> feel cheap because of micro-repayments. But stacking 3 separate plans commits {playerName} to high monthly overheads. He doesn't notice his savings draining away.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              id="btn-bnpl-agree"
              onClick={handleAgreeBNPL}
              className="py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer text-center tracking-wide"
            >
              👍 Agree & Sign up for <FinancialTerm term="bnpl">BNPL</FinancialTerm>: Pay ${totalBnplToday} right now
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. THE NEXT MONTH BANK PAYDAY COLLISION */}
      {step === 'month_collision' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6"
        >
          <div className="text-center space-y-1 shadow-sm border-b border-slate-800 pb-3">
            <Calendar className="text-rose-500 mx-auto animate-bounce" size={32} />
            <span className="font-mono text-rose-500 font-bold uppercase tracking-widest text-[9px]">TIMELINE COMPASS FAST FORWARD</span>
            <h1 className="text-xl font-bold text-white">Next Month: The Payday Collision</h1>
          </div>

          <p className="text-slate-355 text-xs text-slate-300 leading-relaxed">
            Initially, {playerName} gets his items and feels a massive shopping high! However, next month, he forgets about the multiple payment plans he authorized.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500">
              <span>FRIDAY BANK ACCOUNT CLEARANCE:</span>
              <strong className="text-rose-455 uppercase animate-pulse">Pending Drafts</strong>
            </div>

            <div className="space-y-2 border-b border-slate-900 pb-3">
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between text-xs font-mono text-indigo-400">
                  <span>📱 BNPL Draft: {item.name}</span>
                  <strong>-${item.bnplPrice}</strong>
                </div>
              ))}
              <div className="flex justify-between text-xs font-mono text-slate-450">
                <span>⚡ Gym Membership Draft</span>
                <strong>-$35</strong>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-450">
                <span>🎵 Music Streaming Service Draft</span>
                <strong>-$15</strong>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-550">
                <span>{playerName}'s Current Account Cash reserves:</span>
                <strong>+$100</strong>
              </div>
              <div className="flex justify-between text-rose-450 font-bold">
                <span>Pending Draft deductions total:</span>
                <strong>-$145</strong>
              </div>
              <div className="flex justify-between text-rose-500 font-bold text-sm border-t border-slate-900 pt-2 font-black">
                <span>Account balances outstanding:</span>
                <span>-$45 <FinancialTerm term="overdraft">OVERDRAFT</FinancialTerm></span>
              </div>
            </div>
          </div>

          {/* Bankruptcy & Overdraft charge summary */}
          <div className="p-4 bg-red-950/25 border border-red-900/40 rounded-xl space-y-3.5">
            <div className="flex gap-2 items-start">
              <AlertOctagon className="text-rose-500 mt-0.5 shrink-0" size={18} />
              <div>
                <h4 className="text-xs font-bold text-rose-300">Bank Penalty Fees Charged!</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Because BNPL repayments draft separately, 3 individual transactions bounce on empty balances. The bank logs three separate <strong>$35 <FinancialTerm term="overdraft">Overdraft Fees</FinancialTerm></strong>!
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-2 border border-slate-900 rounded font-mono text-[10px] text-center text-rose-400 font-bold flex justify-between">
              <span>3x Bank Overdraft Penalties:</span>
              <span>+$105 Fee additions</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-bnpl-finish-reconcile"
              onClick={handleResolveCollision}
              className="w-full py-4 bg-slate-105 hover:bg-slate-200 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Understand Microtransaction Warnings & Continue ⌛
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
