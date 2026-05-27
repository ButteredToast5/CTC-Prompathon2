import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, CreditCard, ChevronRight, Apple, AlertTriangle, Coins, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GameStats, GroceryItem } from '../types';
import { GROCERY_ITEMS } from '../data';
import FinancialTerm from './FinancialTerm';

interface PathDebitCardProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onFinish: (resultSummary: string) => void;
  playerName?: string;
}

type Step = 'teller' | 'g_intro' | 'g_sorting' | 'g_checkout' | 'emergency' | 'emergency_resolution';

export default function PathDebitCard({ stats, onUpdateStats, onFinish, playerName = 'Petr' }: PathDebitCardProps) {
  const [step, setStep] = useState<Step>('teller');
  
  // Bank Account Split selection
  const [accountConfig, setAccountConfig] = useState<string>('');
  const [checkingBal, setCheckingBal] = useState<number>(0);
  const [savingsBal, setSavingsBal] = useState<number>(0);

  // Grocery Conveyor state
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [cartWants, setCartWants] = useState<GroceryItem[]>([]);
  const [cartNeeds, setCartNeeds] = useState<GroceryItem[]>([]);
  const [skippedItems, setSkippedItems] = useState<GroceryItem[]>([]);
  const [groceryAlert, setGroceryAlert] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // sound effect helper
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

  // 1. BANK SELECTION CHANGER
  const handleTellerChoice = (option: 'checking' | 'savings' | 'both') => {
    playBeep(440, 'sine', 0.12);
    if (option === 'checking') {
      setAccountConfig('Checking Only');
      setCheckingBal(500);
      setSavingsBal(0);
      onUpdateStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 5) }));
    } else if (option === 'savings') {
      setAccountConfig('Savings Only');
      setCheckingBal(0);
      setSavingsBal(500);
      onUpdateStats(prev => ({ ...prev, happiness: Math.max(0, prev.happiness - 10) }));
    } else {
      setAccountConfig('Both (Recommended Split)');
      setCheckingBal(400);
      setSavingsBal(100);
      onUpdateStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 15) }));
    }
    setStep('g_intro');
  };

  // 2. CONVEYOR MINI-GAME HANDLERS
  const handleClassify = (isNeedChoice: boolean) => {
    const item = GROCERY_ITEMS[currentItemIndex];
    const isCorrect = item.isNeed === isNeedChoice;

    if (isCorrect) {
      playBeep(659, 'sine', 0.1);
      setFeedbackMsg({
        text: `Correct! ${item.name} is a ${item.isNeed ? 'NEED non-negotiable for living' : 'WANT non-essential expense'}.`,
        isSuccess: true
      });
    } else {
      playBeep(220, 'triangle', 0.2);
      setFeedbackMsg({
        text: `Incorrect study: ${item.name} represents a ${item.isNeed ? 'NEED (essential for transportation/living)' : 'WANT (gaming & dopamine comforts)'}.`,
        isSuccess: false
      });
    }

    // Add behavior for Wants vs Needs
    if (item.isNeed) {
      // Must buy Needs
      setCartNeeds(prev => [...prev, item]);
    } else {
      // For Wants, they have a choice, but for simplified game they configure now:
      // Let's say if they sorted Want correctly it asks "Shall we buy anyway?" or just "Keep in cart"
    }
  };

  const handleWantOption = (buyIt: boolean) => {
    const item = GROCERY_ITEMS[currentItemIndex];
    setFeedbackMsg(null);
    
    if (buyIt) {
      const currentCartTotal = cartNeeds.reduce((a, b) => a + b.price, 0) + cartWants.reduce((a, b) => a + b.price, 0);
      if (currentCartTotal + item.price > 100) {
        playBeep(200, 'sawtooth', 0.3);
        setGroceryAlert(`🚨 Limit Exceeded! Your budget limit of $100 for grocery store trips cannot afford adding ${item.name} ($${item.price}). Let's put it back to save cash!`);
        setSkippedItems(prev => [...prev, item]);
      } else {
        playBeep(523, 'sine', 0.08);
        setCartWants(prev => [...prev, item]);
      }
    } else {
      playBeep(330, 'sine', 0.1);
      setSkippedItems(prev => [...prev, item]);
    }

    advanceGrocery();
  };

  const advanceGrocery = () => {
    if (currentItemIndex < GROCERY_ITEMS.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      setStep('g_checkout');
    }
  };

  const handleSkipOrGoNext = () => {
    setFeedbackMsg(null);
    const item = GROCERY_ITEMS[currentItemIndex];
    if (item.isNeed) {
      // Auto-added to needs, just advance
      advanceGrocery();
    }
  };

  // CHECKOUT
  const totalGroceryCost = cartNeeds.reduce((a, b) => a + b.price, 0) + cartWants.reduce((a, b) => a + b.price, 0);

  const performCheckout = () => {
    playBeep(880, 'sine', 0.15);
    setTimeout(() => playBeep(1046, 'sine', 0.2), 100);

    // Update balances
    if (checkingBal >= totalGroceryCost) {
      setCheckingBal(prev => prev - totalGroceryCost);
      onUpdateStats(prev => ({
        ...prev,
        cash: prev.cash - totalGroceryCost,
        happiness: prev.happiness + (cartWants.length * 8) - (accountConfig === 'Savings Only' ? 10 : 0)
      }));
    } else {
      // Savings account hit or cash wallet overdraft
      const overdraftAmount = totalGroceryCost - checkingBal;
      setCheckingBal(0);
      if (savingsBal >= overdraftAmount) {
        setSavingsBal(prev => prev - overdraftAmount);
        onUpdateStats(prev => ({
          ...prev,
          cash: prev.cash - totalGroceryCost,
          happiness: Math.max(0, prev.happiness - 10)
        }));
      } else {
        // Petr overdrafts! Overdraft bank fees hit
        const remainder = overdraftAmount - savingsBal;
        setSavingsBal(0);
        onUpdateStats(prev => ({
          ...prev,
          cash: 0,
          debt: prev.debt + remainder + 35, // $35 overdraft fee
          happiness: Math.max(10, prev.happiness - 30)
        }));
      }
    }
    setStep('emergency');
  };

  // EMERGENCY EVENT
  const handleTriggerEmergency = () => {
    playBeep(150, 'sawtooth', 0.5);
    setStep('emergency_resolution');
  };

  const handleResolveEmergency = () => {
    playBeep(523, 'sine', 0.1);
    const cost = 150;

    // Check availability of cash
    // Petr will spend from Savings first, then checking
    if (savingsBal >= cost) {
      setSavingsBal(prev => prev - cost);
      onUpdateStats(prev => ({
        ...prev,
        cash: prev.cash - cost,
        happiness: Math.max(20, prev.happiness - 10)
      }));
    } else {
      const leftover = cost - savingsBal;
      const originalSavings = savingsBal;
      setSavingsBal(0);
      
      if (checkingBal >= leftover) {
        setCheckingBal(prev => prev - leftover);
        onUpdateStats(prev => ({
          ...prev,
          cash: prev.cash - cost,
          happiness: Math.max(15, prev.happiness - 15)
        }));
      } else {
        // Needs parental bailout! High debt and stresses
        const debtTaken = leftover - checkingBal;
        setCheckingBal(0);
        onUpdateStats(prev => ({
          ...prev,
          cash: 0,
          debt: prev.debt + debtTaken,
          happiness: Math.max(10, prev.happiness - 40)
        }));
      }
    }

    // Compose final takeaway & trigger finish
    let reportText = '';
    if (accountConfig === 'Both (Recommended Split)') {
      reportText = `Opened checking and savings accounts successfully. Solved grocery budgeting with a total cost of $${totalGroceryCost}. Shattered screen emergency costing $150 was handled smoothly because $100 was allocated safely in his Emergency Savings Account! He avoided debt interest.`;
    } else if (accountConfig === 'Savings Only') {
      reportText = `Chose to dump everything in Savings. This created high transaction friction. Grocery cost was $${totalGroceryCost}. Handled the broken screen, but faced immense daily wallet constraints.`;
    } else {
      reportText = `Put the entire $500 into Checking. Spent $${totalGroceryCost} on groceries. When his phone shattered, he had no protective Emergency Fund left, dragging checking balances to zero and sliding into outstanding liabilities.`;
    }

    onFinish(reportText);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. BANK TELLER SCENE */}
      {step === 'teller' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-left"
        >
          <div className="flex items-center space-x-3 text-emerald-400">
            <Landmark size={28} />
            <h2 className="text-lg font-bold">Scene 1: Opening the Account</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {playerName} stands at the marble counter of the <strong>Local Credit Union</strong>. Clara, the friendly teller, smiles warmly.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs italic text-slate-400 relative">
            <span className="absolute -top-2 left-4 px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[9px] rounded uppercase font-semibold">Teller Clara</span>
            "Welcome, {playerName}! First week wages? Excellent work! Let's get that cash sorted. Would you like a <FinancialTerm term="checking">Checking account</FinancialTerm> for daily transactions (<FinancialTerm term="debit">Debit card</FinancialTerm>), a <FinancialTerm term="savings">Savings account</FinancialTerm> to keep money safe and earn a trickle of <FinancialTerm term="compound">compound interest</FinancialTerm>, or should we open both for a balanced budget?"
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="teller-option-checking"
              onClick={() => handleTellerChoice('checking')}
              className="w-full p-4 rounded-xl border-2 border-slate-800 hover:border-indigo-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group space-y-1.5"
            >
              <div className="font-black text-slate-100 group-hover:text-indigo-400 text-lg md:text-xl flex items-center gap-2">
                <span>Checking Account Only</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded">Option A</span>
              </div>
              <p className="text-xs text-slate-300">
                Put all $500 in <FinancialTerm term="checking">Checking</FinancialTerm>. Access everything instantly with your new shiny <FinancialTerm term="debit">Debit Card</FinancialTerm>. Savings balance remains $0.
              </p>
            </button>

            <button
              id="teller-option-savings"
              onClick={() => handleTellerChoice('savings')}
              className="w-full p-4 rounded-xl border-2 border-slate-800 hover:border-amber-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group space-y-1.5"
            >
              <div className="font-black text-slate-100 group-hover:text-amber-400 text-lg md:text-xl flex items-center gap-2">
                <span>Savings Account Only</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-955 bg-amber-950 text-amber-500 rounded">Option B</span>
              </div>
              <p className="text-xs text-slate-300">
                Put all $500 in <FinancialTerm term="savings">Savings</FinancialTerm>. Safest way to lock it up for the laptop, but hard to access for quick daily needs.
              </p>
            </button>

            <button
              id="teller-option-both"
              onClick={() => handleTellerChoice('both')}
              className="w-full p-4 rounded-xl border-2 border-emerald-500/50 hover:border-emerald-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group space-y-1.5 bg-emerald-950/20"
            >
              <div className="font-black text-emerald-300 group-hover:text-emerald-400 text-lg md:text-xl flex items-center gap-2">
                <span>Checking & Savings Account Combo</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded">OPTION C (Recommended)</span>
              </div>
              <p className="text-xs text-slate-405 text-slate-300">
                Split of <strong>$400 in <FinancialTerm term="checking">Checking</FinancialTerm> / $100 in <FinancialTerm term="savings">Savings</FinancialTerm></strong>. Earn minor interest on savings, use <FinancialTerm term="debit">debit card</FinancialTerm> for daily necessities up to $400.
              </p>
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. GROCERY INTRO SCREEN */}
      {step === 'g_intro' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-left"
        >
          <div className="flex items-center space-x-3 text-indigo-400">
            <Apple size={28} />
            <h2 className="text-lg font-bold">Needs vs. Wants Budget Challenge</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {playerName} leaves the bank holding a sleek ocean-blue Debit Card. Now, he must head to <strong>Apex Foods & Tech</strong> to stock up for the upcoming college semester.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed">
            He has a <strong>grocery limit of $100</strong>. Items will pass by on an automated checkout conveyor belt. {playerName} must classify them carefully.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-semibold">Rules of the Belt</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800">
                <strong className="text-emerald-400">Needs:</strong> Absolute essentials for survival and duty (Food, transport tickets, warm clothes). Must go into the cart.
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800">
                <strong className="text-rose-400">Wants:</strong> High-energy microtransactions, energy fuels, or designer skins. Skip them to save money!
              </div>
            </div>
          </div>

          <button
            id="btn-grocery-start"
            onClick={() => setStep('g_sorting')}
            className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold font-sans tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Start Budgeting!</span>
            <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {/* 3. GROCERY CONVEYOR BELT GAME */}
      {step === 'g_sorting' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-left"
        >
          {/* Progress gauge */}
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-b border-slate-800 pb-3">
            <span>CONVEYOR ITEM {currentItemIndex + 1} OF {GROCERY_ITEMS.length}</span>
            <span className="text-indigo-400">CART TOTAL: ${cartNeeds.reduce((a, b) => a + b.price, 0) + cartWants.reduce((a, b) => a + b.price, 0)} / $100</span>
          </div>

          {/* Simulated Conveyor Belt */}
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden h-44">
            {/* Belt tracks visual */}
            <div className="absolute bottom-6 w-full h-2 bg-slate-800 opacity-60 flex border-t border-b border-slate-700" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItemIndex}
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -120, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center space-y-2"
              >
                <span className="text-5xl filter drop-shadow">{GROCERY_ITEMS[currentItemIndex].icon}</span>
                <span className="font-bold text-slate-100 text-sm text-center">{GROCERY_ITEMS[currentItemIndex].name}</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">${GROCERY_ITEMS[currentItemIndex].price}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feedback section / Choice controls */}
          <div className="space-y-4">
            {feedbackMsg === null ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  id="btn-classify-need"
                  onClick={() => handleClassify(true)}
                  className="py-3 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-800 text-teal-300 font-semibold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  🥬 This is a Need
                </button>
                <button
                  id="btn-classify-want"
                  onClick={() => handleClassify(false)}
                  className="py-3 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800 text-amber-300 font-semibold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  🎮 This is a Want
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-xl border border-slate-800 text-slate-300 text-xs space-y-3"
              >
                <p className={feedbackMsg.isSuccess ? "text-emerald-400 font-medium" : "text-amber-500 font-medium"}>
                  {feedbackMsg.text}
                </p>
                
                {/* If classified item is a Want, ask player to Indulge or Skip */}
                {!GROCERY_ITEMS[currentItemIndex].isNeed ? (
                  <div className="flex gap-2.5 pt-1.5 border-t border-slate-800/60">
                    <button
                      id="btn-want-buy"
                      onClick={() => handleWantOption(true)}
                      className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Indulge & Add to Cart
                    </button>
                    <button
                      id="btn-want-skip"
                      onClick={() => handleWantOption(false)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs cursor-pointer"
                    >
                      Skip Item & Save Cash
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      id="btn-need-next"
                      onClick={handleSkipOrGoNext}
                      className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Place Essential in Cart
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {groceryAlert && (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-[11px] text-rose-300 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="shrink-0 text-rose-400 mt-0.5" size={14} />
                <span>{groceryAlert}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. GROCERY CHECKOUT SCENE */}
      {step === 'g_checkout' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-left"
        >
          <div className="flex items-center space-x-3 text-emerald-400">
            <Coins size={28} />
            <h2 className="text-lg font-bold">Checkout: Tapping the Debit Card</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Petr places his items at the register. The cashier rings up the grocery haul.
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 font-mono text-xs">
            <h4 className="text-slate-500 border-b border-slate-800 pb-2 uppercase tracking-wide">Grocery Bill Receipts</h4>
            <div className="space-y-1.5">
              {cartNeeds.map(n => (
                <div key={n.id} className="flex justify-between text-slate-300">
                  <span>{n.icon} {n.name} (NEED)</span>
                  <span>${n.price}</span>
                </div>
              ))}
              {cartWants.map(w => (
                <div key={w.id} className="flex justify-between text-indigo-400">
                  <span>{w.icon} {w.name} (WANT)</span>
                  <span>${w.price}</span>
                </div>
              ))}
              {skippedItems.length > 0 && (
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                  Skipped Wants: {skippedItems.map(s => s.name).join(', ')}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm">
              <span className="text-slate-400">TOTAL DUE:</span>
              <span className="text-emerald-400">${totalGroceryCost}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900 text-xs text-indigo-300 leading-normal">
              <strong>Takeaway:</strong> Tapping a debit card instantly deducts from checking. Because it represents your own cash balances, when it hits $0, the terminal declines transactions, preventing debt but restricting excess!
            </div>

            <button
              id="btn-debit-checkout"
              onClick={performCheckout}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm tracking-wide cursor-pointer transition-transform duration-200 active:scale-98 text-center"
            >
              💳 Contactless Tap Tap • Pay Now
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. EMERGENCY ANNOUNCEMENT */}
      {step === 'emergency' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6"
        >
          <div className="inline-flex p-4 bg-rose-950/40 text-rose-500 border border-rose-900 rounded-full animate-bounce">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-rose-500 font-bold uppercase tracking-widest text-xs">Dynamic Event Triggered</span>
            <h1 className="text-2xl font-black text-white">CRASH! CRACK! Oops...</h1>
          </div>

          <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
            While holding his heavy backpack, {playerName} accidentally drops his smartphone onto the asphalt concrete! The display is completely shattered.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 text-xs font-mono max-w-sm mx-auto flex justify-between items-center text-slate-400">
            <span>📞 Screen repair bill (Essential):</span>
            <strong className="text-rose-400">$150</strong>
          </div>

          <button
            id="btn-emergency-next"
            onClick={handleTriggerEmergency}
            className="w-full max-w-xs py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs tracking-wide cursor-pointer transition-colors"
          >
            How will {playerName} pay this unexpected bill?
          </button>
        </motion.div>
      )}

      {/* 6. EMERGENCY RESOLUTION */}
      {step === 'emergency_resolution' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6"
        >
          <div className="flex items-center space-x-3 text-rose-500">
            <ShieldCheck size={28} />
            <h2 className="text-lg font-bold">Emergency Fund Shield</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Life doesn't wait for your checking account or your budgets to line up. {playerName} must pay <strong>$150</strong> right now to get his communication device restored.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-slate-500 font-mono">ACCOUNT STRUCTURE CONFIG:</span>
              <strong className="text-slate-300 uppercase font-mono">{accountConfig}</strong>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 border border-slate-900 rounded bg-slate-900/30">
                <div className="font-mono text-[9px] text-slate-500">CHECKING BALANCE:</div>
                <div className="font-mono font-bold text-slate-300">${checkingBal}</div>
              </div>
              <div className="p-2 border border-slate-900 rounded bg-slate-900/30">
                <div className="font-mono text-[9px] text-slate-500">SAVINGS BALANCE:</div>
                <div className={`font-mono font-bold ${savingsBal > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>${savingsBal}</div>
              </div>
            </div>

            {/* Assessment display */}
            <div className="pt-2 italic text-slate-400 leading-normal">
              {savingsBal >= 100 ? (
                <span className="text-emerald-400 font-medium">
                  ⭐️ Shield Activated! {playerName}'s dedicated $100 <FinancialTerm term="savings">Savings Account</FinancialTerm> acted as an Emergency Fund. He only struggles to find $50 from his remaining <FinancialTerm term="checking">checking cash</FinancialTerm> to fully cover the repair. No debt, no stress penalties!
                </span>
              ) : (
                <span className="text-rose-400 font-medium">
                  ⚠️ No Emergency Fund! All his money was in <FinancialTerm term="checking">checking</FinancialTerm> (and some spent on Wants), or locked totally in savings with zero liquid cash. {playerName} is short on funds to fix his phone. He must acquire outstanding loans and drops overall happiness.
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-indigo-950/20 border border-indigo-900 text-xs text-indigo-300 leading-normal">
              <strong>Lesson:</strong> Life is highly unpredictable. A dedicated savings bucket (an "Emergency Fund") handles unexpected setbacks easily. Without one, even minor issues like a cracked screen force you to take debt.
            </div>

            <button
              id="btn-resolve-debit-emergency"
              onClick={handleResolveEmergency}
              className="w-full py-4 bg-slate-100 hover:bg-stone-200 text-slate-950 font-bold rounded-xl text-xs tracking-wide cursor-pointer text-center"
            >
              Deduct Funds & Finalize Pathway ⌛
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
