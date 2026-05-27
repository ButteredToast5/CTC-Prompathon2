import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Disclaimer from './components/Disclaimer';
import TitleScreen from './components/TitleScreen';
import NameSetup from './components/NameSetup';
import GameHeader from './components/GameHeader';
import SceneIncitingIncident from './components/SceneIncitingIncident';
import PathDebitCard from './components/PathDebitCard';
import PathCreditCard from './components/PathCreditCard';
import PathGambling from './components/PathGambling';
import PathInvestment from './components/PathInvestment';
import PathBNPL from './components/PathBNPL';
import NextDaysGameplay from './components/NextDaysGameplay';
import ReportCard from './components/ReportCard';
import { GameStats, PathType } from './types';

export default function App() {
  const [gameState, setGameState] = useState<'disclaimer' | 'name_setup' | 'title' | 'crossroads' | 'playing' | 'playing_next_days' | 'report'>('disclaimer');
  const [activePath, setActivePath] = useState<PathType>(null);
  const [playerName, setPlayerName] = useState<string>('Petr');
  
  // Player ledger parameters
  const [stats, setStats] = useState<GameStats>({
    cash: 500,
    debt: 0,
    creditScore: 650,
    happiness: 75
  });

  // Narrative summary to pass onto final report card
  const [pathExplanation, setPathExplanation] = useState<string>('');

  const handleResetGame = () => {
    setStats({
      cash: 500,
      debt: 0,
      creditScore: 650,
      happiness: 75
    });
    setActivePath(null);
    setPathExplanation('');
    setGameState('crossroads');
  };

  const handleSaveGame = () => {
    try {
      const payload = {
        stats,
        activePath,
        gameState,
        pathExplanation,
        playerName
      };
      localStorage.setItem('cash_course_save_v1', JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error("Save system failure", e);
      return false;
    }
  };

  const handleLoadSavedGame = () => {
    try {
      const saved = localStorage.getItem('cash_course_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.activePath !== undefined) setActivePath(parsed.activePath);
        if (parsed.gameState) setGameState(parsed.gameState);
        if (parsed.pathExplanation !== undefined) setPathExplanation(parsed.pathExplanation);
        if (parsed.playerName) setPlayerName(parsed.playerName);
        return true;
      }
    } catch (e) {
      console.error("Load system failure", e);
    }
    return false;
  };

  const handleSelectPath = (path: PathType) => {
    setActivePath(path);
    setGameState('playing');
  };

  const handleFinishPath = (explanation: string) => {
    setPathExplanation(explanation);
    // Check if they survived Day 1
    if (stats.cash > 0 && stats.happiness >= 15) {
      setGameState('playing_next_days');
    } else {
      setPathExplanation(
        `${explanation}\n\n🚨 EARLY OUTCOME: ${playerName} ran out of money or hit a severe mental breakdown on Day 1! Game ended prematurely.`
      );
      setGameState('report');
    }
  };

  const handleCompleteNextDays = (nextDaysSummary: string) => {
    setPathExplanation(prev => `${prev}\n\n${nextDaysSummary}`);
    setGameState('report');
  };

  const handleFailEarlyNextDays = (dayNum: number, failSummary: string) => {
    setPathExplanation(prev => `${prev}\n\n🚨 FAILED ON DAY ${dayNum}: ${failSummary}`);
    setGameState('report');
  };

  const currentPathName = () => {
    if (!activePath) return undefined;
    const names: Record<string, string> = {
      debit: 'A - Standard Checking (Secure)',
      credit: 'B - Credit Build/Traps',
      gambling: 'C - Lottery Convenience store',
      investment: 'D - Compounding Investments',
      bnpl: 'E - Buy Now, Pay Later Split'
    };
    return names[activePath];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      <AnimatePresence mode="wait">
        
        {/* DISCLAIMER SCREEN */}
        {gameState === 'disclaimer' && (
          <motion.div
            key="disclaimer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Disclaimer onAcknowledge={() => setGameState('name_setup')} />
          </motion.div>
        )}

        {/* PLAYER NAME SETUP */}
        {gameState === 'name_setup' && (
          <motion.div
            key="name_setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <NameSetup onConfirmName={(name) => { setPlayerName(name); setGameState('title'); }} />
          </motion.div>
        )}

        {/* TITLE SCREEN */}
        {gameState === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TitleScreen onStart={() => setGameState('crossroads')} onLoadSave={handleLoadSavedGame} playerName={playerName} />
          </motion.div>
        )}

        {/* INCITING INCIDENT CROSSROADS */}
        {gameState === 'crossroads' && (
          <motion.div
            key="crossroads"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col min-h-screen"
          >
            <GameHeader stats={stats} onReset={handleResetGame} onSave={handleSaveGame} />
            <main className="flex-grow flex items-center justify-center">
              <SceneIncitingIncident onSelectPath={handleSelectPath} playerName={playerName} />
            </main>
          </motion.div>
        )}

        {/* PLAYING STATE SCENE ROUTERS */}
        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <GameHeader stats={stats} currentPathName={currentPathName()} onReset={handleResetGame} onSave={handleSaveGame} />
            
            <main className="flex-grow flex items-center justify-center py-6">
              {activePath === 'debit' && (
                <PathDebitCard 
                  stats={stats} 
                  onUpdateStats={setStats} 
                  onFinish={handleFinishPath} 
                  playerName={playerName}
                />
              )}
              {activePath === 'credit' && (
                <PathCreditCard 
                  stats={stats} 
                  onUpdateStats={setStats} 
                  onFinish={handleFinishPath} 
                  playerName={playerName}
                />
              )}
              {activePath === 'gambling' && (
                <PathGambling 
                  stats={stats} 
                  onUpdateStats={setStats} 
                  onFinish={handleFinishPath} 
                  playerName={playerName}
                />
              )}
              {activePath === 'investment' && (
                <PathInvestment 
                  stats={stats} 
                  onUpdateStats={setStats} 
                  onFinish={handleFinishPath} 
                  playerName={playerName}
                />
              )}
              {activePath === 'bnpl' && (
                <PathBNPL 
                  stats={stats} 
                  onUpdateStats={setStats} 
                  onFinish={handleFinishPath} 
                  playerName={playerName}
                />
              )}
            </main>
          </motion.div>
        )}

        {/* PLAYING STATE FOR DYNAMIC DAY 2 & DAY 3 */}
        {gameState === 'playing_next_days' && (
          <motion.div
            key="next_days"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <GameHeader stats={stats} currentPathName={currentPathName() ? `${currentPathName()} • Next Days` : 'Next Days'} onReset={handleResetGame} onSave={handleSaveGame} />
            <main className="flex-grow flex items-center justify-center py-6">
              <NextDaysGameplay
                stats={stats}
                onUpdateStats={setStats}
                activePath={activePath}
                onCompleteDays={handleCompleteNextDays}
                onFailEarly={handleFailEarlyNextDays}
                playerName={playerName}
              />
            </main>
          </motion.div>
        )}

        {/* EVALUATION REPORT CARD SCREEN */}
        {gameState === 'report' && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            <GameHeader stats={stats} onReset={handleResetGame} onSave={handleSaveGame} />
            <main className="flex-grow flex items-center justify-center py-8">
              <ReportCard 
                stats={stats} 
                pathExplanation={pathExplanation} 
                onRestart={handleResetGame} 
                playerName={playerName}
              />
            </main>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
