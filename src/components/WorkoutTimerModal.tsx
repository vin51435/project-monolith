'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Bell,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Timer,
  Clock,
  Flag,
  Watch,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';

interface LapItem {
  id: number;
  timeMs: number;
  splitMs: number;
}

interface WorkoutTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  initialSeconds?: number;
  exerciseName?: string;
  onTimerStateChange?: (isActive: boolean) => void;
  isMinimized?: boolean;
  setIsMinimized?: (minimized: boolean) => void;
}

export default function WorkoutTimerModal({
  isOpen,
  onClose,
  onOpen,
  initialSeconds = 60,
  exerciseName = '',
  onTimerStateChange,
  isMinimized: controlledMinimized,
  setIsMinimized: setControlledMinimized,
}: WorkoutTimerModalProps) {
  // Mode selection: 'timer' | 'stopwatch' | 'clock'
  const [activeMode, setActiveMode] = useState<'timer' | 'stopwatch' | 'clock'>('timer');
  const [internalMinimized, setInternalMinimized] = useState<boolean>(false);

  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;
  const setIsMinimized = setControlledMinimized || setInternalMinimized;

  // --------------------------------------------------------------------------
  // 1. COUNTDOWN TIMER STATE
  // --------------------------------------------------------------------------
  const [timerTotalSec, setTimerTotalSec] = useState<number>(initialSeconds);
  const [timerRemainingSec, setTimerRemainingSec] = useState<number>(initialSeconds);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --------------------------------------------------------------------------
  // 2. STOPWATCH STATE
  // --------------------------------------------------------------------------
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [stopwatchIsRunning, setStopwatchIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchStartTimeRef = useRef<number>(0);
  const stopwatchAccumulatedRef = useRef<number>(0);

  // --------------------------------------------------------------------------
  // 3. CLOCK & WORKOUT SESSION STATE
  // --------------------------------------------------------------------------
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [sessionSec, setSessionSec] = useState<number>(0);
  const [sessionRunning, setSessionRunning] = useState<boolean>(true);

  // Prevent auto-start on first load
  const isFirstMount = useRef(true);

  // Sync external initialSeconds trigger when modal opens (ready in paused state)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (isOpen && initialSeconds > 0) {
      setTimerTotalSec(initialSeconds);
      setTimerRemainingSec(initialSeconds);
      setTimerIsRunning(false);
      setActiveMode('timer');
      setIsMinimized(false);
    }
  }, [isOpen, initialSeconds, exerciseName]);

  // Notify parent of active running state
  useEffect(() => {
    onTimerStateChange?.(timerIsRunning || stopwatchIsRunning);
  }, [timerIsRunning, stopwatchIsRunning, onTimerStateChange]);

  // High-impact sports gym alarm chime + haptic vibration (played when rest timer hits 0)
  const playChime = useCallback(() => {
    // 1. Mobile Haptic Vibration Alert
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {
        // Ignore vibration errors
      }
    }

    if (!soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Triple energetic sports buzzer alert (0.0s -> 0.2s -> 0.4s)
      const playBeep = (
        freq: number,
        startTime: number,
        duration: number,
        isFinal: boolean = false
      ) => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 1.5, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(isFinal ? 0.85 : 0.65, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        subOsc.start(startTime);
        osc.stop(startTime + duration);
        subOsc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playBeep(880, now, 0.16); // Burst 1: High A5
      playBeep(1046.5, now + 0.2, 0.16); // Burst 2: High C6
      playBeep(1318.5, now + 0.4, 0.65, true); // Burst 3 (Grand Finish): E6 ring
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // --------------------------------------------------------------------------
  // TIMER TICKER EFFECT
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (timerIsRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemainingSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setTimerIsRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerIsRunning, playChime]);

  // --------------------------------------------------------------------------
  // STOPWATCH TICKER EFFECT (High precision)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (stopwatchIsRunning) {
      stopwatchStartTimeRef.current = performance.now();
      stopwatchIntervalRef.current = setInterval(() => {
        const elapsed = performance.now() - stopwatchStartTimeRef.current;
        setStopwatchMs(stopwatchAccumulatedRef.current + elapsed);
      }, 30);
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
      stopwatchAccumulatedRef.current = stopwatchMs;
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [stopwatchIsRunning]);

  // --------------------------------------------------------------------------
  // REAL-TIME CLOCK & SESSION TICKER
  // --------------------------------------------------------------------------
  useEffect(() => {
    setCurrentTime(new Date());
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
      if (sessionRunning) {
        setSessionSec((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(clockInterval);
  }, [sessionRunning]);

  // Timer Actions
  const setTimerPreset = (secs: number) => {
    setTimerTotalSec(secs);
    setTimerRemainingSec(secs);
    setTimerIsRunning(true);
  };

  const adjustTimerTime = (delta: number) => {
    setTimerRemainingSec((prev) => Math.max(5, prev + delta));
    setTimerTotalSec((prev) => Math.max(5, prev + delta));
  };

  const resetTimer = () => {
    setTimerIsRunning(false);
    setTimerRemainingSec(timerTotalSec);
  };

  const toggleTimerRun = () => {
    if (timerRemainingSec === 0) {
      setTimerRemainingSec(timerTotalSec);
      setTimerIsRunning(true);
    } else {
      setTimerIsRunning(!timerIsRunning);
    }
  };

  // Stopwatch Actions
  const toggleStopwatchRun = () => {
    setStopwatchIsRunning(!stopwatchIsRunning);
  };

  const resetStopwatch = () => {
    setStopwatchIsRunning(false);
    setStopwatchMs(0);
    stopwatchAccumulatedRef.current = 0;
    setLaps([]);
  };

  const addLap = () => {
    if (stopwatchMs === 0) return;
    const lastLapTime = laps.length > 0 ? laps[0].timeMs : 0;
    const splitMs = stopwatchMs - lastLapTime;
    const newLap: LapItem = {
      id: laps.length + 1,
      timeMs: stopwatchMs,
      splitMs: splitMs > 0 ? splitMs : stopwatchMs,
    };
    setLaps([newLap, ...laps]);
  };

  // Formatters
  const formatStopwatch = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      hundredths: String(hundredths).padStart(2, '0'),
    };
  };

  const formatSessionTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }
    return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  // If completely closed and neither timer nor stopwatch is running, render nothing
  const isBackgroundActive = timerIsRunning || stopwatchIsRunning;
  if (!isOpen && !isBackgroundActive) return null;

  // --------------------------------------------------------------------------
  // FLOATING MINI-WIDGET (WHEN MINIMIZED OR CLOSED WHILE ACTIVE)
  // --------------------------------------------------------------------------
  const handleMaximize = () => {
    setIsMinimized(false);
    onOpen?.();
  };

  if (!isOpen || isMinimized) {
    if (!isBackgroundActive && !isOpen) return null;

    const timerMin = Math.floor(timerRemainingSec / 60);
    const timerSec = timerRemainingSec % 60;
    const swTime = formatStopwatch(stopwatchMs);

    return (
      <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-50 animate-fadeIn">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-indigo-500/70 shadow-2xl backdrop-blur-md text-white ring-1 ring-indigo-500/30">
          {/* Main Time Display Clickable Area */}
          <button
            type="button"
            onClick={handleMaximize}
            className="flex items-center gap-2 hover:opacity-80 transition group"
            title="Click to maximize timer"
          >
            {activeMode === 'timer' && (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  {timerIsRunning ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </>
                  ) : (
                    <span className="inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                  )}
                </span>
                <span
                  className={`text-xs font-black font-mono tracking-tight ${
                    timerRemainingSec <= 5 && timerRemainingSec > 0
                      ? 'text-rose-400 animate-pulse'
                      : 'text-white'
                  }`}
                >
                  ⏱ {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
                </span>
              </>
            )}

            {activeMode === 'stopwatch' && (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  {stopwatchIsRunning ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </>
                  ) : (
                    <span className="inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
                  )}
                </span>
                <span className="text-xs font-black font-mono text-indigo-300">
                  ⏱ {swTime.minutes}:{swTime.seconds}.{swTime.hundredths}
                </span>
              </>
            )}

            {activeMode === 'clock' && (
              <>
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold font-mono text-white">
                  {currentTime
                    ? currentTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </span>
              </>
            )}
          </button>

          {/* Quick Play/Pause Control */}
          {activeMode === 'timer' && (
            <button
              type="button"
              onClick={toggleTimerRun}
              className={`p-1 rounded-lg border transition active:scale-90 ${
                timerIsRunning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/40'
              }`}
              title={timerIsRunning ? 'Pause' : 'Start'}
            >
              {timerIsRunning ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
            </button>
          )}

          {activeMode === 'stopwatch' && (
            <button
              type="button"
              onClick={toggleStopwatchRun}
              className={`p-1 rounded-lg border transition active:scale-90 ${
                stopwatchIsRunning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/40'
              }`}
              title={stopwatchIsRunning ? 'Stop' : 'Start'}
            >
              {stopwatchIsRunning ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
            </button>
          )}

          {/* Maximize Button */}
          <button
            type="button"
            onClick={handleMaximize}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Maximize Suite"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // FULL MODAL SUITE
  // --------------------------------------------------------------------------
  const timerMin = Math.floor(timerRemainingSec / 60);
  const timerSec = timerRemainingSec % 60;
  const timerProgress =
    timerTotalSec > 0 ? ((timerTotalSec - timerRemainingSec) / timerTotalSec) * 100 : 0;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;
  const swTime = formatStopwatch(stopwatchMs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
        {/* Top Header: Title & Action Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Workout Timer Suite</h3>
              <p className="text-[10px] text-slate-400 font-medium">Countdown &bull; Chronometer &bull; Clock</p>
            </div>
          </div>

          {/* Minimize & Close Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition active:scale-95"
              title="Minimize to floating widget"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsMinimized(false);
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition active:scale-95"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs (3 equal columns - guaranteed zero overflow on any screen) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMode('timer')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              activeMode === 'timer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Timer className="w-4 h-4 shrink-0" />
            <span>Timer</span>
          </button>

          <button
            onClick={() => setActiveMode('stopwatch')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              activeMode === 'stopwatch'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Watch className="w-4 h-4 shrink-0" />
            <span>Stopwatch</span>
          </button>

          <button
            onClick={() => setActiveMode('clock')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              activeMode === 'clock'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Clock</span>
          </button>
        </div>

        {/* ===================================================================
            TAB 1: COUNTDOWN REST TIMER
        =================================================================== */}
        {activeMode === 'timer' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Title / Exercise Name */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Rest Interval Countdown</h3>
                {exerciseName ? (
                  <p className="text-xs text-indigo-400 font-semibold truncate max-w-[200px]">
                    {exerciseName}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">Post-set muscle recovery</p>
                )}
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition ${
                  soundEnabled
                    ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title={soundEnabled ? 'Sound Enabled' : 'Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Circular Countdown Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="stroke-slate-800"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className={`transition-all duration-300 ease-linear ${
                      timerRemainingSec <= 5 && timerRemainingSec > 0
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
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                      timerRemainingSec === 0
                        ? 'text-emerald-400 animate-pulse'
                        : timerRemainingSec <= 5
                        ? 'text-rose-400 animate-ping'
                        : 'text-white'
                    }`}
                  >
                    {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {timerRemainingSec === 0
                      ? 'GO NEXT SET!'
                      : timerIsRunning
                      ? 'RESTING'
                      : 'PAUSED'}
                  </span>
                </div>
              </div>

              {/* Adjust +/- 15s */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => adjustTimerTime(-15)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 active:scale-95 transition"
                >
                  <Minus className="w-3 h-3" /> 15s
                </button>
                <button
                  onClick={() => adjustTimerTime(15)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 active:scale-95 transition"
                >
                  <Plus className="w-3 h-3" /> 15s
                </button>
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleTimerRun}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition ${
                  timerIsRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {timerIsRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" /> Start
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-1.5">
                Quick Presets
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[30, 45, 60, 75, 90, 120, 150, 180].map((presetSec) => (
                  <button
                    key={presetSec}
                    onClick={() => setTimerPreset(presetSec)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                      timerTotalSec === presetSec && timerRemainingSec > 0
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {presetSec}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: STOPWATCH WITH LAPS
        =================================================================== */}
        {activeMode === 'stopwatch' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-white">Precision Chronometer</h3>
              <p className="text-[11px] text-slate-400">
                Isometric holds, planks, hang times &amp; lap tracking
              </p>
            </div>

            {/* Big Stopwatch Display */}
            <div className="py-5 px-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="font-mono text-4xl sm:text-5xl font-black text-indigo-400 tracking-tight">
                {swTime.minutes}:{swTime.seconds}
                <span className="text-2xl sm:text-3xl text-slate-500 font-bold ml-1">
                  .{swTime.hundredths}
                </span>
              </div>
            </div>

            {/* Stopwatch Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetStopwatch}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition"
                title="Reset Stopwatch"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={addLap}
                disabled={!stopwatchIsRunning && stopwatchMs === 0}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" /> Lap
              </button>

              <button
                onClick={toggleStopwatchRun}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition ${
                  stopwatchIsRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {stopwatchIsRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" /> Start
                  </>
                )}
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Lap #</span>
                  <span>Split Time</span>
                  <span>Total Time</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  {laps.map((lap) => {
                    const splitFormatted = formatStopwatch(lap.splitMs);
                    const totalFormatted = formatStopwatch(lap.timeMs);
                    return (
                      <div
                        key={lap.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono"
                      >
                        <span className="font-bold text-indigo-400">Lap {lap.id}</span>
                        <span className="text-slate-300">
                          +{splitFormatted.minutes}:{splitFormatted.seconds}.{splitFormatted.hundredths}
                        </span>
                        <span className="font-bold text-white">
                          {totalFormatted.minutes}:{totalFormatted.seconds}.{totalFormatted.hundredths}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: DIGITAL CLOCK & WORKOUT SESSION DURATION
        =================================================================== */}
        {activeMode === 'clock' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-white">Clock &amp; Session Duration</h3>
              <p className="text-[11px] text-slate-400">
                Real-time current time and active workout session elapsed time
              </p>
            </div>

            {/* Real-time Clock Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Current Time
              </span>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
              </div>
              <p className="text-xs text-indigo-400 font-semibold">
                {currentTime ? currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </p>
            </div>

            {/* Workout Session Stopwatch */}
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-center space-y-2">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Active Workout Session Duration
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {formatSessionTime(sessionSec)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setSessionRunning(!sessionRunning)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                    sessionRunning
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-emerald-600 text-white border-emerald-500'
                  }`}
                >
                  {sessionRunning ? 'Pause Session' : 'Resume Session'}
                </button>
                <button
                  onClick={() => setSessionSec(0)}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                >
                  Reset Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
