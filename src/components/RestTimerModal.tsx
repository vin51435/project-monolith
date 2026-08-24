'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, Bell, Plus, Minus, Volume2, VolumeX } from 'lucide-react';

interface RestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds?: number;
  exerciseName?: string;
}

export default function RestTimerModal({
  isOpen,
  onClose,
  initialSeconds = 60,
  exerciseName = '',
}: RestTimerModalProps) {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial seconds when changed externally
  useEffect(() => {
    if (initialSeconds > 0) {
      setTotalSeconds(initialSeconds);
      setRemainingSeconds(initialSeconds);
      setIsRunning(true);
    }
  }, [initialSeconds, exerciseName]);

  // Web Audio chime generator
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Ignore audio autoplay restrictions
    }
  }, [soundEnabled]);

  // Countdown effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, playChime]);

  const setTimerPreset = (secs: number) => {
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(true);
  };

  const adjustTime = (delta: number) => {
    setRemainingSeconds((prev) => Math.max(5, prev + delta));
    setTotalSeconds((prev) => Math.max(5, prev + delta));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const toggleRun = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Rest Timer</h3>
              {exerciseName ? (
                <p className="text-xs text-indigo-400 font-medium truncate max-w-[180px]">
                  {exerciseName}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Between sets recovery</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-slate-800 text-indigo-400 border-slate-700'
                  : 'bg-slate-800/50 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Sound On' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular Countdown Display */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                className="stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                className={`transition-all duration-300 ease-linear ${
                  remainingSeconds <= 5 && remainingSeconds > 0
                    ? 'stroke-rose-500'
                    : 'stroke-indigo-500'
                }`}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span
                className={`text-4xl font-extrabold tracking-tight font-mono ${
                  remainingSeconds === 0
                    ? 'text-emerald-400 animate-pulse'
                    : remainingSeconds <= 5
                    ? 'text-rose-400 animate-ping'
                    : 'text-white'
                }`}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                {remainingSeconds === 0 ? 'GO NEXT SET!' : isRunning ? 'RESTING' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Quick +/- 15s adjustments */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => adjustTime(-15)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 active:scale-95 transition"
            >
              <Minus className="w-3.5 h-3.5" /> 15s
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" /> 15s
            </button>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleRun}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" /> Start
              </>
            )}
          </button>
        </div>

        {/* Preset Quick Buttons */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick Rest Presets
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[30, 45, 60, 75, 90, 120].map((presetSec) => (
              <button
                key={presetSec}
                onClick={() => setTimerPreset(presetSec)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  totalSeconds === presetSec && remainingSeconds > 0
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {presetSec}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
