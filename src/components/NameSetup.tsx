import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface NameSetupProps {
  onConfirmName: (name: string) => void;
}

export default function NameSetup({ onConfirmName }: NameSetupProps) {
  const [nameInput, setNameInput] = useState('');

  // Built-in cool alternative dynamic options just to assist
  const suggestions = ['Petr', 'Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'];

  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() ? nameInput.trim() : 'Petr';
    playBeep(587, 'sine', 0.15);
    onConfirmName(finalName);
  };

  const handleQuickSelect = (suggestedName: string) => {
    setNameInput(suggestedName);
    playBeep(440, 'sine', 0.08);
  };

  return (
    <div id="name-setup-screen" className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.04),transparent_45%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border-2 border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative"
      >
        {/* Core Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
            <User size={24} />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-black uppercase">
            CHARACTER IDENTITY SETUP
          </span>
          <h2 className="text-2xl font-display font-black tracking-tight text-white">
            Choose Your Name
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Experience the three-day budgeting course first-hand under your own identity, or proceed with the classic story.
          </p>
        </div>

        {/* Input Form with ID attributes */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="player-name-input" className="block font-mono text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              ENTER CHARACTER NAME
            </label>
            <div className="relative">
              <input
                id="player-name-input"
                type="text"
                autoFocus
                placeholder="Petr (Default)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={18}
                className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-sans font-bold tracking-wide"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600">
                {nameInput.length}/18
              </span>
            </div>
          </div>

          {/* Quick suggestions chips */}
          <div className="space-y-2">
            <span className="block font-mono text-[9px] uppercase text-slate-500 font-bold tracking-wider">
              QUICK SUGGESTIONS
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((name) => (
                <button
                  key={name}
                  id={`chip-name-${name.toLowerCase()}`}
                  type="button"
                  onClick={() => handleQuickSelect(name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all border cursor-pointer ${
                    (nameInput.trim() === name || (!nameInput.trim() && name === 'Petr'))
                      ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/60 shadow shadow-indigo-900/30'
                      : 'bg-slate-950/30 text-slate-400 border-slate-850 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Helpful Tips container */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-850 flex items-start gap-2 text-[10px] text-slate-400 leading-normal">
            <Sparkles size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <span>
              Your selected name will replace all dialogue, bank ledgers, and statement warnings over the 3-day course gameplay!
            </span>
          </div>

          {/* Action trigger button */}
          <button
            id="btn-confirm-name"
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black tracking-wide text-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950/40"
          >
            <span>{nameInput.trim() ? `CONFIRM CHARACTER: ${nameInput.toUpperCase()}` : 'PROCEED AS PETR'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
