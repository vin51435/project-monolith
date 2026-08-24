'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldCheck, Delete, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthLockProps {
  onUnlock: () => void;
}

// Simple SHA-256 hash helper using browser native Web Crypto API
async function hashPin(pin: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(pin + '_salt_nexus_drift');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function AuthLock({ onUnlock }: AuthLockProps) {
  const [pin, setPin] = useState<string>('');
  const [savedHash, setSavedHash] = useState<string | null>(null);
  const [isSettingNewPin, setIsSettingNewPin] = useState<boolean>(false);
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>('enter');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);

  useEffect(() => {
    const existing = localStorage.getItem('nexus_app_pin');
    if (!existing) {
      setIsSettingNewPin(true);
      setStep('create');
    } else {
      setSavedHash(existing);
      setStep('enter');
    }
  }, []);

  const triggerShake = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100);
    }
    setTimeout(() => {
      setShake(false);
      setPin('');
      setConfirmPin('');
    }, 600);
  };

  const handleKeyPress = async (digit: string) => {
    setErrorMsg('');

    if (step === 'enter') {
      const nextPin = pin + digit;
      if (nextPin.length <= 4) {
        setPin(nextPin);
        if (nextPin.length === 4) {
          const hashed = await hashPin(nextPin);
          if (hashed === savedHash) {
            if (rememberDevice) {
              localStorage.setItem('nexus_auth_session', 'active');
            } else {
              sessionStorage.setItem('nexus_auth_session', 'active');
            }
            onUnlock();
          } else {
            triggerShake('Incorrect PIN');
          }
        }
      }
    } else if (step === 'create') {
      const nextPin = pin + digit;
      if (nextPin.length <= 4) {
        setPin(nextPin);
        if (nextPin.length === 4) {
          setConfirmPin('');
          setStep('confirm');
        }
      }
    } else if (step === 'confirm') {
      const nextConfirm = confirmPin + digit;
      if (nextConfirm.length <= 4) {
        setConfirmPin(nextConfirm);
        if (nextConfirm.length === 4) {
          if (nextConfirm === pin) {
            const hashed = await hashPin(nextConfirm);
            localStorage.setItem('nexus_app_pin', hashed);
            localStorage.setItem('nexus_auth_session', 'active');
            onUnlock();
          } else {
            triggerShake('PINs did not match. Try again.');
            setStep('create');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 'confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
    setErrorMsg('');
  };

  const activeInput = step === 'confirm' ? confirmPin : pin;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-none">
      <div className="w-full max-w-sm flex flex-col items-center space-y-6 text-center">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10 animate-fadeIn">
          {step === 'enter' ? <Lock className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
        </div>

        {/* Title & Instructions */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {step === 'enter' && 'Private Access'}
            {step === 'create' && 'Set 4-Digit Passcode'}
            {step === 'confirm' && 'Confirm Your Passcode'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'enter' && 'Enter your PIN to unlock'}
            {step === 'create' && 'Create a private 4-digit PIN for this app'}
            {step === 'confirm' && 'Re-enter your 4-digit PIN to confirm'}
          </p>
        </div>

        {/* 4 PIN Dots */}
        <div
          className={`flex items-center gap-4 py-2 transition-transform ${
            shake ? 'animate-bounce text-rose-500' : ''
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = activeInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  isFilled
                    ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-md shadow-indigo-500/50'
                    : 'bg-slate-900 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-xs font-semibold text-rose-400 animate-fadeIn">
            {errorMsg}
          </p>
        )}

        {/* Keypad (3x4 Grid) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xl font-bold text-white shadow-md active:scale-90 active:bg-indigo-600 transition"
            >
              {digit}
            </button>
          ))}

          {/* Bottom Row */}
          <div className="flex items-center justify-center" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xl font-bold text-white shadow-md active:scale-90 active:bg-indigo-600 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition"
            title="Delete digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Remember on this device checkbox */}
        {step === 'enter' && (
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
            />
            <span>Keep unlocked on this device</span>
          </label>
        )}
      </div>
    </div>
  );
}
