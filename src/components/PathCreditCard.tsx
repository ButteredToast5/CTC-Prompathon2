import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ArrowRight, ShieldAlert, Award, ChevronRight, Calculator, AlertTriangle, BadgeAlert } from 'lucide-react';
import { GameStats } from '../types';
import FinancialTerm from './FinancialTerm';

interface PathCreditCardProps {
  stats: GameStats;
  onUpdateStats: (updater: (prev: GameStats) => GameStats) => void;
  onFinish: (resultSummary: string) => void;
  playerName?: string;
}

type Step = 'choose_card' | 'laptop_purchase' | 'billing' | 'time_skip';

export default function PathCreditCard({ stats, onUpdateStats, onFinish, playerName = 'Petr' }: PathCreditCardProps) {
  const [step, setStep] = useState<Step>('choose_card');
  const [selectedCard, setSelectedCard] = useState<'secured' | 'premium' | null>(null);
  
  // Game states
  const [laptopType, setLaptopType] = useState<string>('');
  const [cardLimit, setCardLimit] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);

  // Billing states
  const [billChoice, setBillChoice] = useState<'full' | 'minimum' | 'partial' | null>(null);

  // Sound triggers
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

  const handleCardSelection = (card: 'secured' | 'premium') => {
    playBeep(440, 'sine', 0.12);
    setSelectedCard(card);
    if (card === 'secured') {
      setCardLimit(300);
      setApr(15); // Secured cards have decent APR or require deposit
      setLaptopType('Refurbished Student laptop ($250)');
      setDebtAmount(250);
      onUpdateStats(prev => ({
        ...prev,
        creditScore: Math.min(850, prev.creditScore + 30)
      }));
    } else {
      setCardLimit(1000);
      setApr(29); // Premium sketchy APR
      setLaptopType('Brand-New Premium Gaming laptop ($600)');
      setDebtAmount(600);
      onUpdateStats(prev => ({
        ...prev,
        creditScore: Math.max(300, prev.creditScore - 10)
      }));
    }
    setStep('laptop_purchase');
  };

  const proceedToBilling = () => {
    playBeep(554, 'sine', 0.1);
    setStep('billing');
  };

  const handleBillingPayment = (choice: 'full' | 'minimum' | 'partial') => {
    playBeep(440, 'sine', 0.12);
    setBillChoice(choice);
    setStep('time_skip');
  };

  // Perform time skip calculation
  const getMonthsTimeline = () => {
    let list = [];
    let currentDebt = debtAmount;
    let paymentPerMonth = billChoice === 'minimum' ? 25 : billChoice === 'partial' ? 80 : debtAmount;
    
    // Monthly interest calculations (APR / 12)
    const monthlyRate = (apr / 100) / 12;

    for (let month = 1; month <= 6; month++) {
      let interestCharges = currentDebt * monthlyRate;
      let newDebt = currentDebt + interestCharges;
      let actualPayment = Math.min(newDebt, paymentPerMonth);
      let balanceLeft = newDebt - actualPayment;

      list.push({
        month,
        initial: Math.round(currentDebt),
        interest: Math.round(interestCharges),
        payment: Math.round(actualPayment),
        ending: Math.round(balanceLeft)
      });

      currentDebt = balanceLeft;
    }
    return { list, endingDebt: Math.round(currentDebt) };
  };

  const timelineData = getMonthsTimeline();

  const handleCompletePath = () => {
    playBeep(880, 'sine', 0.3);
    const endingDebt = timelineData.endingDebt;
    
    if (selectedCard === 'secured') {
      onUpdateStats(prev => ({
        ...prev,
        cash: prev.cash - 250, // Paid in full
        debt: 0,
        creditScore: Math.min(850, prev.creditScore + 80), // Perfect behavior
        happiness: Math.min(100, prev.happiness + 20)
      }));

      onFinish(`Applied for a Secured Credit Card with a safe $300 limit. Avoided high-interest debt traps. Bought a refurbished laptop for $250 and paid off the monthly statement in full immediately. Outstanding credit score increased!`);
    } else {
      // Premium Gold path
      if (billChoice === 'minimum') {
        const totalPaid = 150; // $25 * 6
        onUpdateStats(prev => ({
          ...prev,
          cash: Math.max(0, prev.cash - totalPaid),
          debt: endingDebt,
          creditScore: Math.max(300, prev.creditScore - 120), // Poor behavior / carrying heavy high APR debt
          happiness: Math.max(10, prev.happiness - 35)
        }));

        onFinish(`Fell for the Premium Gold Card promotion to acquire a brand new $600 laptop on 29% interest (APR). Carried a heavy revolving debt, paying only the $25 minimum balance. Hit massive APR penalties, leaving him trapped in $${endingDebt} debt after paying $150 cash!`);
      } else {
        const totalPaid = 480; // $80 * 6
        onUpdateStats(prev => ({
          ...prev,
          cash: Math.max(0, prev.cash - totalPaid),
          debt: endingDebt,
          creditScore: Math.max(300, prev.creditScore - 30), // Carrying minor APR card balance
          happiness: Math.max(20, prev.happiness - 15)
        }));

        onFinish(`Subscribed to the Premium Credit Card and paid $80 partial repayments. Faced APR penalties. Managed to keep debt down to $${endingDebt} but lost massive cash to compounding credit card interest rates.`);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. CHOOSE CREDIT CARD */}
      {step === 'choose_card' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-3 text-indigo-400">
            <CreditCard size={28} />
            <h2 className="text-lg font-bold">Scene 1: Applying for Credit</h2>
          </div>

          <p className="text-slate-300 text-base md:text-lg tracking-tight font-medium leading-relaxed">
            {playerName} wants to buy a laptop immediately for <strong>$600</strong>, but he only has $500 cash in hand. He searches online for <FinancialTerm term="credit">credit card</FinancialTerm> options to bridge the gap.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2">
            
            {/* Secured option */}
            <button
              id="card-option-secured"
              onClick={() => handleCardSelection('secured')}
              className="p-5 rounded-2xl border-2 border-slate-800 hover:border-emerald-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group space-y-2 bg-emerald-950/5"
            >
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-100 group-hover:text-emerald-400 text-lg md:text-xl flex items-center gap-1.5">
                  📁 <FinancialTerm term="secured">Student Secured Credit Card</FinancialTerm>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded uppercase font-black">SAFE</span>
              </div>
              <p className="text-xs text-slate-305 text-slate-300 leading-relaxed">
                Requires placing a <strong>$300 security deposit</strong> (held by the bank). In return, you get a strict <strong>$300 spending limit</strong>. Excellent for building <FinancialTerm term="credit_score">credit score</FinancialTerm> with zero risk of catastrophic overspending.
              </p>
              <div className="text-[10.5px] font-mono text-slate-400 flex gap-4">
                <span>LIMIT: $300</span>
                <span>DEPOSIT: $300</span>
                <span><FinancialTerm term="apr">APR: 15%</FinancialTerm></span>
              </div>
            </button>

            {/* Premium Gold Option (TRAP) */}
            <button
              id="card-option-premium"
              onClick={() => handleCardSelection('premium')}
              className="p-5 rounded-2xl border-2 border-slate-800 hover:border-rose-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group space-y-2 bg-rose-950/5"
            >
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-100 group-hover:text-rose-400 text-lg md:text-xl flex items-center gap-1.5">
                  💳 <FinancialTerm term="credit">Premium "Aura Gold" Credit Card</FinancialTerm>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded uppercase font-black">TRAP RISK</span>
              </div>
              <p className="text-xs text-slate-305 text-slate-300 leading-relaxed">
                Promises a high <strong>$1,000 credit limit</strong> instantly without a security deposit! However, carrying a balance incurs <strong><FinancialTerm term="apr">29.9% APR (annual percentage rate)</FinancialTerm></strong> penalty interest.
              </p>
              <div className="text-[10.5px] font-mono text-slate-400 flex gap-4">
                <span>LIMIT: $1,000</span>
                <span>DEPOSIT: $0</span>
                <span className="text-rose-400 font-bold"><FinancialTerm term="apr">APR: 29.9%</FinancialTerm></span>
              </div>
            </button>

          </div>
        </motion.div>
      )}

      {/* 2. LAPTOP PURCHASE */}
      {step === 'laptop_purchase' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6"
        >
          <div className="flex items-center space-x-3 text-indigo-400">
            <Award size={28} />
            <h2 className="text-lg font-bold">Scene 2: Purchasing the Laptop</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {playerName} swipes his newly approved credit card over the modern checkout counter.
          </p>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-850 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <span className="font-bold text-slate-400 text-xs uppercase font-mono">Approved Laptop</span>
              <span className="text-[11px] bg-indigo-950 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wide">APPROVED</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-white text-base font-bold">{laptopType}</h3>
              <p className="text-slate-400 text-xs">
                {selectedCard === 'secured' ? (
                  `Because the Secured Card has a $300 limit, ${playerName} cannot afford the $600 model. Instead, he plays it smart and buys a Refurbished Student laptop for $250! He has perfect utility with $50 remaining credit room.`
                ) : (
                  `With a $1,000 credit card limit, ${playerName} buys the top-tier $600 brand-new Gaming computer! He only pays $0 out of pocket at checkout today, carrying $600 credit debt on the card statement.`
                )}
              </p>
            </div>

            <div className="p-3 bg-slate-900/50 border border-slate-900 rounded-lg flex justify-between font-mono text-xs items-center">
              <span className="text-slate-500">LIABILITY BALANCE:</span>
              <strong className="text-rose-400">${debtAmount} DEBT</strong>
            </div>
          </div>

          <button
            id="btn-laptop-checkout"
            onClick={proceedToBilling}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm cursor-pointer tracking-wide flex items-center justify-center space-x-2"
          >
            <span>One Month Passes • See the Statement Bill</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {/* 3. MONTHLY BILLING */}
      {step === 'billing' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-5"
        >
          <div className="flex items-center space-x-3 text-amber-500">
            <Calculator size={28} />
            <h2 className="text-lg font-bold">Scene 3: The Bill Arrives</h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            One month later, the credit card statement pinged {playerName}'s email inbox. He owes a total of <strong>${debtAmount}</strong>. It's time to choose a payments structure.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-2 text-xs font-mono">
            <span className="text-slate-500">STATEMENT OUTSTANDING:</span>
            <div className="flex justify-between items-center text-sm font-bold pt-1">
              <span className="text-slate-300">Total Balance Due</span>
              <span className="text-rose-400">${debtAmount}</span>
            </div>
            {selectedCard === 'premium' && (
              <div className="text-[10px] text-rose-500 uppercase font-semibold">
                ⚠️ APR interest rate charges will trigger if not paid in full!
              </div>
            )}
          </div>

          <div className="space-y-3">
            {selectedCard === 'secured' ? (
              <button
                id="bill-option-secured-full"
                onClick={() => handleBillingPayment('full')}
                className="w-full p-4 rounded-xl border border-emerald-500/40 hover:border-emerald-500 hover:bg-slate-800/40 text-left transition-all cursor-pointer group bg-emerald-950/5"
              >
                <div className="font-bold text-slate-100 group-hover:text-emerald-400 text-sm">
                  Pay Full Balance (${debtAmount})
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {playerName} has $500 cash in hand. He pays the full $250 credit bill. Card drops back to $0 debt. He pays exactly $0 in interest fees, keeping his wallet secure.
                </p>
              </button>
            ) : (
              <>
                {/* option 1: Minimum repayment */}
                <button
                  id="bill-option-premium-minimum"
                  onClick={() => handleBillingPayment('minimum')}
                  className="w-full p-4 rounded-xl border border-slate-800 hover:border-rose-400 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-rose-400 text-sm flex justify-between items-center">
                    <span>Pay Minimum Balance ($25)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded uppercase font-semibold">TRAP</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Pay only $25 to keep the card active. Sounds incredibly cheap! But the remaining $575 is carried over, subjected to a heavy 29% APR interest charge.
                  </p>
                </button>

                {/* option 2: Partial active repayment */}
                <button
                  id="bill-option-premium-partial"
                  onClick={() => handleBillingPayment('partial')}
                  className="w-full p-4 rounded-xl border border-slate-800 hover:border-amber-400 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-amber-400 text-sm">
                    Pay Partial Balance ($80)
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Pay $80. Takes a larger bite out of the laptop debt, but still subject to APR interest on the rest.
                  </p>
                </button>

                {/* option 3: Full repayment disabled block */}
                <button
                  disabled
                  title={`${playerName} only has $500 cash and cannot afford to pay the full $600 balance!`}
                  className="w-full p-4 rounded-xl border border-dashed border-slate-800 opacity-40 text-left cursor-not-allowed bg-slate-950/20"
                >
                  <div className="font-bold text-slate-500 text-sm flex justify-between items-center">
                    <span>Pay Statement in Full ($600)</span>
                    <span className="text-[9px] font-mono px-1.5 bg-slate-900 text-slate-500 py-0.5 rounded">LOCKED</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">
                    {playerName} cannot select this. The statement balance ($600) is higher than his entire checking cash wallet ($500). This is the risk of spending beyond your cash holdings!
                  </p>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. TIME SKIP SIMULATION */}
      {step === 'time_skip' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6"
        >
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <span className="font-mono text-indigo-400 font-bold uppercase tracking-widest text-[11px] animate-pulse">TIMELAPSE: SIX MONTHS Fast Forward</span>
            <h1 className="text-2xl font-black text-white">How Compound Interest Penalizes</h1>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-350">Interest Penalties Timeline Table:</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-slate-400 font-mono">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 uppercase font-black">
                    <th className="pb-2 text-left">Mo.</th>
                    <th className="pb-2 text-center">Initial</th>
                    <th className="pb-2 text-center">Interest</th>
                    <th className="pb-2 text-center">Paid</th>
                    <th className="pb-2 text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard === 'secured' ? (
                    <tr className="border-b border-slate-900">
                      <td className="py-2.5 text-slate-300 font-bold">M1</td>
                      <td className="text-center">$250</td>
                      <td className="text-center text-emerald-400">$0</td>
                      <td className="text-center text-teal-400">$250</td>
                      <td className="text-right font-bold text-emerald-400">$0</td>
                    </tr>
                  ) : (
                    timelineData.list.map(row => (
                      <tr key={row.month} className="border-b border-slate-850/60 hover:bg-slate-950/20">
                        <td className="py-2.1 text-slate-300 font-bold">Month {row.month}</td>
                        <td className="text-center">${row.initial}</td>
                        <td className="text-center text-rose-400">+${row.interest}</td>
                        <td className="text-center text-teal-400">-${row.payment}</td>
                        <td className="text-right font-bold text-slate-200">${row.ending}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Analysis card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
              {selectedCard === 'secured' ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Award size={14} /> Perfect Execution!
                  </span>
                  <p className="text-xs text-slate-350 leading-normal">
                    {playerName} cleared his balance and built superb historical credit consistency. He paid <strong>$0 in interest fees</strong> and sleeps soundly knowing his <FinancialTerm term="credit_score">credit score</FinancialTerm> is skyrocketing!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5 uppercase tracking-wide">
                    <BadgeAlert size={14} /> Revolving Interest Debt Trap!
                  </span>
                  <p className="text-xs text-slate-350 leading-normal">
                    {playerName} paid a total of <strong>${billChoice === 'minimum' ? '$150' : '$480'}</strong> over six months. However, because of the <FinancialTerm term="apr">29.9% APR</FinancialTerm>, his laptop is costing him immense <FinancialTerm term="compound">compounding interest</FinancialTerm> fees and his balance is still outstanding at <strong className="text-rose-400">${timelineData.endingDebt}</strong>! His debt barely budged.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-credit-finish"
              onClick={handleCompletePath}
              className="w-full py-4 bg-slate-100 hover:bg-stone-200 text-slate-950 font-bold rounded-xl text-sm transition-transform duration-250 cursor-pointer text-center shadow"
            >
              Understand Takeaway & Continue ⌛
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
