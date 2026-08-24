'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Delete, ArrowRight } from 'lucide-react';

interface AuthLockProps {
  onUnlock: () => void;
}

const PASSCODE = '51435';

export default function AuthLock({ onUnlock }: AuthLockProps) {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);

  const checkPin = (entered: string) => {
    if (entered === PASSCODE) {
      if (rememberDevice) {
        localStorage.setItem('nexus_auth_session', 'active');
      } else {
        sessionStorage.setItem('nexus_auth_session', 'active');
      }
      onUnlock();
    } else {
      setErrorMsg('Incorrect Passcode');
      setShake(true);
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 500);
    }
  };

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    const next = pin + digit;
    if (next.length <= 5) {
      setPin(next);
      if (next.length === 5) {
        checkPin(next);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  // Keyboard event listener for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter' && pin.length === 5) {
        checkPin(pin);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, rememberDevice]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-none">
      <div className="w-full max-w-xs flex flex-col items-center space-y-6 text-center animate-fadeIn">
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Private Access
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter passcode to continue
          </p>
        </div>

        {/* 5 Passcode Dots */}
        <div
          className={`flex items-center gap-3 py-2 transition-transform ${
            shake ? 'animate-bounce text-rose-500' : ''
          }`}
        >
          {[0, 1, 2, 3, 4].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                  isFilled
                    ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-md shadow-indigo-500/50'
                    : 'bg-slate-900 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg ? (
          <p className="text-xs font-bold text-rose-400 animate-fadeIn h-4">
            {errorMsg}
          </p>
        ) : (
          <div className="h-4" />
        )}

        {/* Keypad (3x4 Grid) */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-13 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xl font-bold text-white shadow-sm active:scale-90 active:bg-indigo-600 transition"
            >
              {digit}
            </button>
          ))}

          {/* Bottom Row */}
          <div className="flex items-center justify-center" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-13 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xl font-bold text-white shadow-sm active:scale-90 active:bg-indigo-600 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-13 py-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition"
            title="Delete digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Remember on this device checkbox */}
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
          />
          <span>Remember on this device</span>
        </label>
      </div>
    </div>
  );
}
