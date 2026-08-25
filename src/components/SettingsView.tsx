'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Play,
  Database,
  Info
} from 'lucide-react';

interface SettingsViewProps {
  currentDayId: string;
  currentDayTitle: string;
  onLockApp: () => void;
}

export default function SettingsView({
  currentDayId,
  currentDayTitle,
  onLockApp,
}: SettingsViewProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [storedSetsCount, setStoredSetsCount] = useState<number>(0);

  // Load sound preference and count stored sets on mount
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem('nexus_timer_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }

      const rawSets = localStorage.getItem('nexus_completed_sets_v1');
      if (rawSets) {
        const parsed = JSON.parse(rawSets);
        if (parsed.sets) {
          const count = Object.values(parsed.sets).filter(Boolean).length;
          setStoredSetsCount(count);
        }
      } else {
        setStoredSetsCount(0);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('nexus_timer_sound_enabled', String(next));
    } catch {}
  };

  // Test sound buzzer
  const handleTestChime = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([150, 80, 200]);
      }
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      const playBeep = (freq: number, start: number, dur: number, isFinal: boolean = false) => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 1.5, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(isFinal ? 0.8 : 0.6, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        subOsc.start(start);
        osc.stop(start + dur);
        subOsc.stop(start + dur);
      };

      playBeep(880, now, 0.15);
      playBeep(1046.5, now + 0.18, 0.15);
      playBeep(1318.5, now + 0.36, 0.6, true);
    } catch {}
  };

  const handleResetToday = () => {
    window.dispatchEvent(
      new CustomEvent('nexus_reset_progress', { detail: { dayId: currentDayId } })
    );
    setResetFeedback(`Today's sets cleared!`);
    setTimeout(() => setResetFeedback(null), 3000);
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all completed sets across all 7 days?')) {
      window.dispatchEvent(new CustomEvent('nexus_reset_progress', { detail: {} }));
      setStoredSetsCount(0);
      setResetFeedback('All 7-day progress reset!');
      setTimeout(() => setResetFeedback(null), 3000);
    }
  };

  const handleClearSession = () => {
    try {
      localStorage.removeItem('nexus_auth_session');
      sessionStorage.removeItem('nexus_auth_session');
      onLockApp();
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn pb-12">
      {/* Page Title Header */}
      <div className="flex items-center gap-3 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">App Settings &amp; Preferences</h2>
          <p className="text-xs sm:text-sm text-slate-400">Workout reset options, audio timer alerts &amp; local storage</p>
        </div>
      </div>

      {/* Feedback Toast */}
      {resetFeedback && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs sm:text-sm font-bold shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{resetFeedback}</span>
        </div>
      )}

      {/* SECTION 1: WORKOUT RESET CONTROLS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Workout Reset Options</h3>
          </div>
          <span className="text-xs text-slate-400">Progress Management</span>
        </div>

        <div className="space-y-3">
          {/* Reset Today */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
            <div>
              <p className="text-sm font-bold text-white">Reset Today&apos;s Routine</p>
              <p className="text-xs text-slate-400">{currentDayTitle}</p>
            </div>
            <button
              onClick={handleResetToday}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition active:scale-95 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Today</span>
            </button>
          </div>

          {/* Reset All 7 Days */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition">
            <div>
              <p className="text-sm font-bold text-rose-300">Reset All 7-Day Splits</p>
              <p className="text-xs text-slate-400">Clears all checked sets across the entire program</p>
            </div>
            <button
              onClick={handleResetAll}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition active:scale-95 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Days</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: 16-HOUR INACTIVITY EXPIRATION */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Local Persistence &amp; Auto-Reset</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
            16h Inactivity Window
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Completed sets are saved directly on this browser.</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pl-6">
            If there is no workout activity for 16 consecutive hours, the routine automatically clears so your next session starts fresh.
          </p>
        </div>
      </div>

      {/* SECTION 3: REST TIMER AUDIO */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Rest Timer Audio Alerts</h3>
          </div>
          <span className="text-xs text-slate-400">Gym Buzzer Sound</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div>
              <p className="text-sm font-bold text-white">Alarm Buzzer Chime</p>
              <p className="text-xs text-slate-400">High-volume triple chime + vibration at 0s</p>
            </div>
            <button
              onClick={handleToggleSound}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition active:scale-95 ${
                soundEnabled
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>
          </div>

          <button
            onClick={handleTestChime}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
            <span>Test Audio Alarm Chime</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: SECURITY & STORAGE STATS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Security &amp; Device Storage</h3>
          </div>
          <span className="text-xs text-slate-400">Local Only</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Cached Completed Sets:</span>
            </span>
            <span className="font-bold text-white">{storedSetsCount} sets recorded</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onLockApp}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Lock Application</span>
            </button>

            <button
              onClick={handleClearSession}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition active:scale-95"
            >
              <span>End Passcode Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
