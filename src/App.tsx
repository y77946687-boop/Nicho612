/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertCircle, HelpCircle, Trophy, XCircle } from 'lucide-react';

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(5);
  const [message, setMessage] = useState<string>('Guess a number between 1 and 20');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [history, setHistory] = useState<number[]>([]);

  const startNewGame = useCallback(() => {
    setTargetNumber(Math.floor(Math.random() * 20) + 1);
    setAttempts(5);
    setGuess('');
    setMessage('Guess a number between 1 and 20');
    setGameState('playing');
    setHistory([]);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 20) {
      setMessage('Please enter a valid number between 1 and 20');
      return;
    }

    const newHistory = [numGuess, ...history];
    setHistory(newHistory);

    if (numGuess === targetNumber) {
      setGameState('won');
      setMessage('You Win! 🎉');
    } else {
      const remaining = attempts - 1;
      setAttempts(remaining);

      if (remaining === 0) {
        setGameState('lost');
        setMessage(`Game Over! The number was ${targetNumber}.`);
      } else {
        setMessage(numGuess > targetNumber ? 'Too high! Try lower.' : 'Too low! Try higher.');
      }
    }
    setGuess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-3 bg-indigo-100 rounded-2xl mb-4"
          >
            <HelpCircle className="w-10 h-10 text-indigo-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Number Guess</h1>
          <p className="text-gray-500 font-medium">Can you find the secret number?</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Attempts Left</div>
            <div className={`text-2xl font-black ${attempts <= 2 ? 'text-red-500' : 'text-indigo-600'}`}>
              {attempts}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={message}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-4 rounded-2xl text-center font-bold text-lg flex items-center justify-center gap-2 ${
                gameState === 'won' ? 'bg-emerald-100 text-emerald-700' :
                gameState === 'lost' ? 'bg-red-100 text-red-700' :
                'bg-indigo-50 text-indigo-700'
              }`}
            >
              {gameState === 'won' && <Trophy className="w-6 h-6" />}
              {gameState === 'lost' && <XCircle className="w-6 h-6" />}
              {gameState === 'playing' && <AlertCircle className="w-6 h-6" />}
              {message}
            </motion.div>
          </AnimatePresence>

          {gameState === 'playing' ? (
            <form onSubmit={handleGuess} className="space-y-4">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="1-20"
                className="w-full text-center text-4xl font-bold p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors"
                autoFocus
                min="1"
                max="20"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-xl"
              >
                <CheckCircle2 className="w-6 h-6" />
                Submit Guess
              </button>
            </form>
          ) : (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={startNewGame}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-xl"
            >
              <RefreshCw className="w-6 h-6" />
              Play Again
            </motion.button>
          )}

          {history.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Previous Guesses</div>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      h === targetNumber ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {h}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Created By</p>
            <a 
              href="https://t.me/Nicho612" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors group"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.83 7.422l-1.996 9.412c-.15.672-.548.838-1.112.52l-3.042-2.242-1.468 1.412c-.162.162-.3.3-.614.3l.218-3.102 5.646-5.1c.246-.218-.054-.34-.38-.124l-6.98 4.394-3.006-.94c-.654-.204-.666-.654.136-.966l11.75-4.528c.544-.204 1.02.122.848.864z"/>
              </svg>
              <span className="font-bold">@Nicho612</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
