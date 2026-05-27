import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, CreditCard, Ticket, Sparkles, ShoppingCart, Info, Wallet, ShieldAlert, Heart, ArrowRight, HelpCircle } from 'lucide-react';
import { PathType } from '../types';

interface SceneIncitingIncidentProps {
  onSelectPath: (path: PathType) => void;
  playerName?: string;
}

export default function SceneIncitingIncident({ onSelectPath, playerName = 'Petr' }: SceneIncitingIncidentProps) {
  const [step, setStep] = useState<'intro' | 'meters' | 'blueprint'>('intro');
  const [pendingPath, setPendingPath] = useState<PathType>(null);

  const getPathDetails = (path: PathType) => {
    switch (path) {
      case 'debit':
        return {
          title: "Path A: Standard Checking Account & Debit Card",
          risk: "SECURE • NO DEBT",
          description: "Deposit the paycheck cash with a friendly bank teller. Open a Checking account and use a Debit Card, preventing debt entirely. Learn how to budget for Needs and Wants.",
          financialImpact: "Cash is kept secure. Debt risk is 0%. Cannot build standard credit score history."
        };
      case 'credit':
        return {
          title: "Path B: Apply for a Credit Card & Buy Laptop",
          risk: "SCORE BUILDER • HIGH RISK",
          description: "Apply for a credit card online to buy the Laptop immediately! Learn about security deposits, statement cycles, minimum payments, and catastrophic 29.9% APR interest penalties.",
          financialImpact: "Possibility to build high credit score history. Extremely high interest debt risk if bills are carried."
        };
      case 'gambling':
        return {
          title: "Path C: Speculators' Lotto Scratch Tickets",
          risk: "99% LOSS RATIO • HIGH LOSS TRAP",
          description: "Skip banks and indices. Walk into a convenience store to buy instant scratch games. Discover the reality of extreme loss percentages versus dopamine-rush traps.",
          financialImpact: "High chance of losing entire starting paycheck. Extreme stress triggers."
        };
      case 'investment':
        return {
          title: "Path D: Index Fund Investments & Sis's Guidance",
          risk: "LONG-TERM COMPOUND • GROWTH",
          description: "Consult with smart econ sister Maya to discover S&P 500 indexing, dividends, compound interest formulas, versus volatile high-leverage cryptocurrency slots.",
          financialImpact: "Builds compounding interest returns. Explores high-growth indexing vs. zero-sum currency speculations."
        };
      case 'bnpl':
        return {
          title: "Path E: 'Zero-Down' Buy Now, Pay Later Plan",
          risk: "AUTOMATED SLICE TRAP • COMPASSIONATE LURE",
          description: "Trigger multiple overlapping small installment drawer payments on checking deposits online. Discover why splitting costs with invisible dates is the fastest path to budget overdrafts.",
          financialImpact: "Instant ownership of tools, but commitments stack automated pay-day withdrawals into high penalty traps."
        };
      default:
        return {
          title: "Unknown Path",
          risk: "",
          description: "",
          financialImpact: ""
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none font-sans">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: MEET PETR & EXPLAIN TOP METERS */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Visual illustration box of passenger bedroom */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-slate-700 bg-slate-800/90 flex flex-col md:flex-row shadow-2xl items-stretch">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />

              <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-center p-6 md:p-8 z-10 w-full">
                
                {/* Left Column: Bedroom Interior Illustration Visual */}
                <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-950/75 rounded-2xl border border-slate-800/80 text-center space-y-4">
                  {/* Scene representing bedroom */}
                  <div className="relative w-full h-40 bg-indigo-950/40 rounded-xl border border-indigo-900/40 flex items-center justify-center overflow-hidden">
                    <div className="absolute bottom-0 w-full h-8 bg-amber-950/20" /> {/* floor */}
                    <div className="absolute bottom-8 left-4 w-28 h-10 bg-indigo-800 rounded-t-lg border-t-4 border-teal-500" />
                    <div className="absolute top-6 right-6 p-2 bg-slate-900/90 border border-slate-700/50 rounded-lg text-xs font-mono text-slate-300 shadow-lg flex items-center space-x-1 animate-bounce">
                      <span>💻 Laptop ($600)</span>
                    </div>

                    {/* Character Graphic */}
                    <div className="absolute bottom-5 right-12 flex flex-col items-center">
                      <div className="text-4xl filter drop-shadow">☕</div>
                      <div className="w-10 h-14 bg-emerald-600/80 rounded-t-lg border border-emerald-500/30 flex items-end justify-center pb-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-100 font-mono">{playerName}</span>
                      </div>
                    </div>

                    {/* Envelope graphic */}
                    <div className="absolute bottom-4 left-14 p-1 px-2.5 bg-emerald-500 border border-emerald-400 text-slate-950 text-xs font-mono font-bold rounded shadow-md flex items-center gap-1">
                      <span>💸</span>
                      <span>$500</span>
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className="w-full text-slate-300 text-xs text-left bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5 font-sans leading-relaxed">
                    <div className="text-emerald-400 font-mono font-bold text-[10px] uppercase">{playerName.toUpperCase()}'S BRAIN:</div>
                    <p className="italic">"Whoa. Five hundred bucks. I earned this! I really need a laptop for school and gaming... but it makes me sweat having this cash sitting inside my desk drawer under a pile of homework."</p>
                  </div>
                </div>

                {/* Right Column: Narrative Introduction Text */}
                <div className="md:col-span-3 space-y-4 text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono font-bold tracking-wide">
                    <span>Payday Crossroads Intro</span>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight">
                    Meet {playerName}: The Freshly Minted Barista
                  </h1>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {playerName} just completed his first week washing steam wands and drawing latte art. He was handed an envelope with <strong className="text-emerald-400">$500 in cool, crisp cash</strong>.
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    He wants to buy a school laptop eventually (which retails for <strong>$600</strong>), but keeping cash lying under a mattress feels sketchy. He is stuck at a financial crossroads.
                  </p>
                </div>
              </div>
            </div>

            {/* Continue button leading to Meter Tutorial */}
            <div className="flex justify-center pt-2">
              <button
                id="btn-next-meters"
                onClick={() => setStep('meters')}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-black tracking-wide transition-all scale-100 active:scale-95 cursor-pointer shadow-lg border-b-4 border-indigo-900 active:border-b-0 flex items-center justify-center gap-2 shadow-indigo-900/40"
              >
                <span>LEARN ABOUT THE FINANCIAL METERS</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 1.5: WELCOME TO THE COURSE - UNDERSTAND METERS */}
        {step === 'meters' && (
          <motion.div
            key="meters"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* BAR EXPLANATION TUTORIAL - Clear and concise! */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 text-left shadow-lg">
              <h3 className="font-mono text-xs uppercase text-indigo-400 tracking-widest font-black flex items-center gap-1.55">
                <HelpCircle size={16} /> Welcome to the Course: Understand the Meters Above
              </h3>
              <p className="text-xs text-slate-400">
                To successfully guide {playerName} through his life choices, monitor the four crucial financial parameters displayed at the top bar of your interface:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 flex gap-3.5 items-start">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                    <Wallet size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">1. CASH METER (Wealth)</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal text-slate-400">
                      Measures {playerName}'s available bank or pocket cash. The goal is to build savings and grow this wealth pool to safely make key purchases like a school laptop.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 flex gap-3.5 items-start">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
                    <Landmark size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">2. DEBT METER (Owed capital)</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal text-slate-400">
                      Measures outstanding credit card bills or installment loan obligations. The goal is to avoid carrying unpaid balances to minimize high interest fees.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 flex gap-3.5 items-start">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">3. CREDIT RATING (Borrowing index)</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal text-slate-400">
                      Measures {playerName}'s borrow trustworthiness and creditworthiness. The goal is to maximize this score by making on-time payments to qualify for better loan rates.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 flex gap-3.5 items-start">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                    <Heart size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">4. MOOD / HAPPINESS (Stress limits)</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal text-slate-400">
                      Measures {playerName}'s emotional well-being and stress levels. The goal is to balance smart financial discipline while keeping happiness high and avoiding stress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Button and Back Button */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => setStep('intro')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-sans font-bold text-sm tracking-wide transition-all cursor-pointer border border-slate-700 w-full sm:w-auto text-center"
                >
                  ← Back to Introduction
                </button>
                <button
                  id="btn-next-blueprint"
                  onClick={() => setStep('blueprint')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-black tracking-wide transition-all scale-100 active:scale-95 cursor-pointer shadow-lg border-b-4 border-indigo-900 active:border-b-0 flex items-center justify-center gap-2 w-full sm:w-auto text-center"
                >
                  <span>UNDERSTOOD, CHOOSE BLUEPRINT!</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PATHWAY CHOICE GRID WITH LARGE FONTS & CONFIRMATIONS */}
        {step === 'blueprint' && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {pendingPath === null ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="font-mono text-cyan-400 font-bold uppercase tracking-widest text-[11px]">THE FIVE SYSTEM BLUEPRINTS</span>
                  <h2 className="text-3xl font-display font-black text-white tracking-tight">Choose {playerName}'s Initial Pathway</h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Decide how {playerName} will manage his first hard-earned paycheck ($500). Font options are enlarged for visual accessibility.
                  </p>
                </div>

                {/* 5 Grid path choices with VERY BIG text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  {/* Path A */}
                  <button
                    id="btn-choice-debit"
                    onClick={() => setPendingPath('debit')}
                    className="group text-left p-5 md:p-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 border-b-4 border-indigo-900 text-white w-full transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-indigo-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Landmark size={28} className="text-indigo-200" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-lg md:text-xl leading-snug flex items-center gap-2">
                        Path A: Checking Drawer
                        <span className="text-[10px] font-mono bg-indigo-800 text-indigo-100 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          Secure
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed">
                        Open a bank Checking Draft Account. Deposit cool cash safely to avoid card carrying risks. Bypasses credit interest entirely.
                      </p>
                    </div>
                  </button>

                  {/* Path B */}
                  <button
                    id="btn-choice-credit"
                    onClick={() => setPendingPath('credit')}
                    className="group text-left p-5 md:p-6 rounded-2xl bg-purple-600 hover:bg-purple-500 border-b-4 border-purple-900 text-white w-full transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-purple-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <CreditCard size={28} className="text-purple-200" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-lg md:text-xl leading-snug flex items-center gap-2">
                        Path B: Apply Credit Card
                        <span className="text-[10px] font-mono bg-purple-900 text-purple-200 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          BUILDER
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed">
                        Setup credit lines with automated card drafts. Put security deposits down, test statement scores, or unlock instant purchases!
                      </p>
                    </div>
                  </button>

                  {/* Path C */}
                  <button
                    id="btn-choice-gambling"
                    onClick={() => setPendingPath('gambling')}
                    className="group text-left p-5 md:p-6 rounded-2xl bg-rose-600 hover:bg-rose-500 border-b-4 border-rose-900 text-white w-full transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-rose-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Ticket size={28} className="text-rose-200" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-lg md:text-xl leading-snug flex items-center gap-2">
                        Path C: Lottery Tickets
                        <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded uppercase font-black tracking-widest animate-pulse">
                          RISKY SPEC
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-rose-100/90 leading-relaxed">
                        Spend pocket cash buying instant cash cards at convenience stores. Chase multiplier jackpots with real-life 99% loss probabilities!
                      </p>
                    </div>
                  </button>

                  {/* Path D */}
                  <button
                    id="btn-choice-investment"
                    onClick={() => setPendingPath('investment')}
                    className="group text-left p-5 md:p-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-900 text-white w-full transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Sparkles size={28} className="text-emerald-200" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-lg md:text-xl leading-snug flex items-center gap-2">
                        Path D: Index Investment
                        <span className="text-[10px] font-mono bg-emerald-955 bg-emerald-950 text-emerald-305 text-emerald-300 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          COMPOUND
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
                        Consult with economics ph.d sister Maya. Buy diversified S&P indexing holdings or explore highly volatile crypto slots.
                      </p>
                    </div>
                  </button>

                  {/* Path E */}
                  <button
                    id="btn-choice-bnpl"
                    onClick={() => setPendingPath('bnpl')}
                    className="group text-left p-5 md:p-6 rounded-2xl bg-slate-700 hover:bg-slate-600 border-b-4 border-slate-900 text-white md:col-span-2 w-full transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-start gap-4"
                  >
                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <ShoppingCart size={28} className="text-slate-300" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-display font-black text-lg md:text-xl leading-snug flex items-center gap-2">
                        Path E: Split Buy Now Pay Later
                        <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          SPLIT TRAP
                        </span>
                      </p>
                      <p className="text-xs md:text-sm text-slate-20 flex-grow text-slate-200 leading-relaxed">
                        Buy items online using easy checkout plans divided into 4 small chunks. Stacks multiple installment dates with automated overdraft risks.
                      </p>
                    </div>
                  </button>

                </div>

                {/* Back button to tutorial */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setStep('meters')}
                    className="text-slate-500 hover:text-slate-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    ← Review Meter Tutorials
                  </button>
                </div>
              </div>
            ) : (
              /* DEDICATED CONFIRMATION CARD PAGE - HIGH SEGMENTATION & MASSIVE READABILITY */
              <motion.div
                key="confirm-decision"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto p-6 md:p-10 rounded-3xl bg-slate-900 border-4 border-slate-700 text-left space-y-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/5 rounded-full filter blur-2xl pointer-events-none" />

                <div className="space-y-2 relative z-10">
                  <span className="font-mono text-cyan-400 font-black uppercase tracking-widest text-xs flex items-center gap-1.5">
                    ⚙️ DECISION CONFIRMATION BLUEPRINT
                  </span>
                  
                  {/* Financial Options especially bigger in font! */}
                  <h2 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
                    Confirm {playerName}'s Roadmap choice?
                  </h2>
                </div>

                <div className="p-5 md:p-6 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-4">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold">
                      {pendingPath === 'debit' && <Landmark size={24} />}
                      {pendingPath === 'credit' && <CreditCard size={24} />}
                      {pendingPath === 'gambling' && <Ticket size={24} />}
                      {pendingPath === 'investment' && <Sparkles size={24} />}
                      {pendingPath === 'bnpl' && <ShoppingCart size={24} />}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl text-yellow-500">
                        {getPathDetails(pendingPath).title}
                      </h3>
                      <span className="text-[10px] font-mono text-indigo-300 uppercase font-black tracking-widest">
                        {getPathDetails(pendingPath).risk}
                      </span>
                    </div>
                  </div>

                  {/* Description of Path - Larger easy to read index */}
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
                    {getPathDetails(pendingPath).description}
                  </p>

                  <div className="p-4 border-l-4 border-emerald-500 bg-emerald-950/10 rounded-r-lg">
                    <h4 className="text-[10px] font-mono uppercase text-emerald-400 font-black tracking-widest">EXPECTED DIRECT SYSTEM IMPACT:</h4>
                    <p className="text-xs text-slate-300 leading-normal font-sans pt-1">
                      {getPathDetails(pendingPath).financialImpact}
                    </p>
                  </div>
                </div>

                {/* Big confirmation actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    id="btn-confirm-yes"
                    onClick={() => {
                      onSelectPath(pendingPath);
                      setPendingPath(null);
                    }}
                    className="flex-grow py-4 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-950 text-slate-950 font-display font-black text-lg rounded-2xl text-center shadow-lg active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🟢 YES, LOCK IN BLUEPRINT!</span>
                  </button>

                  <button
                    id="btn-confirm-cancel"
                    onClick={() => setPendingPath(null)}
                    className="py-4 px-6 bg-slate-800 hover:bg-slate-705 bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 text-slate-300 text-sm font-sans font-bold rounded-2xl text-center active:scale-[0.99] translate-y-0 active:translate-y-[4px] active:border-b-0 cursor-pointer"
                  >
                    <span>Go Back</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
