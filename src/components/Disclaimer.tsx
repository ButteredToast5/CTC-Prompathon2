import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  onAcknowledge: () => void;
}

export default function Disclaimer({ onAcknowledge }: DisclaimerProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col justify-center items-center px-6 py-12 selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-slate-800/80 backdrop-blur border-4 border-slate-700 p-8 rounded-3xl shadow-2xl text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 border-2 border-rose-500/30 rounded-full text-rose-400 mb-2">
          <ShieldAlert size={36} />
        </div>

        <h1 className="font-display font-black text-xs uppercase tracking-[0.25em] text-indigo-300">
          Responsible Education Advisory
        </h1>

        <div className="space-y-4">
          <p className="font-display text-white font-black leading-relaxed text-lg">
            WE DO NOT ENDORSE GAMBLING.
          </p>
          <p className="font-mono text-xs text-slate-300 leading-relaxed text-justify bg-slate-900/90 p-5 rounded-2xl border-2 border-slate-800">
            By continuing, you acknowledge that this website is strictly of general educational utility regarding retail financial mechanics. The simulation contains illustrative representations of commercial lotteries, credit indices, and speculative assets. The creators and publishers are not responsible for any future decisions, losses, or gambling behavior.
          </p>
        </div>

        <button
          id="btn-acknowledge"
          onClick={onAcknowledge}
          className="w-full mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-black tracking-wide transition-all active:scale-98 cursor-pointer shadow-md border-b-4 border-indigo-900 active:border-b-0 translate-y-0 active:translate-y-[4px]"
        >
          I Acknowledge
        </button>
      </motion.div>
    </div>
  );
}
