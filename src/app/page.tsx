'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DayWorkoutView from '@/components/DayWorkoutView';
import AuthLock from '@/components/AuthLock';
import Footer from '@/components/Footer';
import { ExerciseDetail, WORKOUT_DAYS, EXERCISE_DATABASE } from '@/data/workoutData';

// Code-split secondary views for fast first-paint
const NightRoutineView = dynamic(() => import('@/components/NightRoutineView'), {
  loading: () => (
    <div className="min-h-[300px] flex items-center justify-center text-slate-500 text-xs sm:text-sm animate-pulse">
      Loading Night Routine...
    </div>
  ),
});

const ProgressionView = dynamic(() => import('@/components/ProgressionView'), {
  loading: () => (
    <div className="min-h-[300px] flex items-center justify-center text-slate-500 text-xs sm:text-sm animate-pulse">
      Loading Calendar &amp; Streaks...
    </div>
  ),
});

const ExerciseLibraryView = dynamic(() => import('@/components/ExerciseLibraryView'), {
  loading: () => (
    <div className="min-h-[300px] flex items-center justify-center text-slate-500 text-xs sm:text-sm animate-pulse">
      Loading 40 Exercise Guides...
    </div>
  ),
});

const SettingsView = dynamic(() => import('@/components/SettingsView'), {
  loading: () => (
    <div className="min-h-[300px] flex items-center justify-center text-slate-500 text-xs sm:text-sm animate-pulse">
      Loading App Preferences...
    </div>
  ),
});

const WorkoutTimerModal = dynamic(() => import('@/components/WorkoutTimerModal'), {
  ssr: false,
});

export default function HomePage() {
  const [authState, setAuthState] = useState<'checking' | 'unlocked' | 'locked'>('checking');
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');

  // Timer / Stopwatch / Clock Suite State
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerExerciseName, setTimerExerciseName] = useState<string>('');
  const [timerTrigger, setTimerTrigger] = useState<{ id: number; autoStart: boolean }>({
    id: 0,
    autoStart: false,
  });

  // Exercise Library Selection State
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<ExerciseDetail | null>(null);

  const currentDay = WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  // 1. Check saved auth session, active tab, selected day & exercise on mount
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem('nexus_auth_session') === 'active';
      const isSessionActive = sessionStorage.getItem('nexus_auth_session') === 'active';
      if (isRemembered || isSessionActive) {
        setAuthState('unlocked');
      } else {
        setAuthState('locked');
      }

      // Restore active tab
      const savedTab = sessionStorage.getItem('nexus_active_tab');
      if (savedTab) {
        setActiveTab(savedTab);
      }

      // Restore selected workout day
      const savedDayId = sessionStorage.getItem('nexus_selected_day_id');
      if (savedDayId) {
        setSelectedDayId(savedDayId);
      }

      // Restore selected exercise detail if opened in library
      const savedExNum = sessionStorage.getItem('nexus_selected_exercise_num');
      if (savedExNum) {
        const num = parseInt(savedExNum, 10);
        const found = EXERCISE_DATABASE.find((e) => e.num === num);
        if (found) {
          setSelectedExerciseDetail(found);
        }
      }
    } catch {
      setAuthState('locked');
    }
  }, []);

  // 2. Persist & Restore Scroll Position on reload
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('nexus_scroll_y');
    if (savedScroll) {
      const scrollY = parseInt(savedScroll, 10);
      if (!isNaN(scrollY) && scrollY > 0) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
          }, 80);
        });
      }
    }

    const handleScroll = () => {
      sessionStorage.setItem('nexus_scroll_y', String(window.scrollY));
    };

    const handleBeforeUnload = () => {
      sessionStorage.setItem('nexus_scroll_y', String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTab]);

  const handleLockApp = () => {
    localStorage.removeItem('nexus_auth_session');
    sessionStorage.removeItem('nexus_auth_session');
    setAuthState('locked');
  };

  const handleTabChange = (tab: string, shouldScrollToTop: boolean = false) => {
    setActiveTab(tab);
    try {
      sessionStorage.setItem('nexus_active_tab', tab);
    } catch {}
    if (tab !== 'library') {
      setSelectedExerciseDetail(null);
      try {
        sessionStorage.removeItem('nexus_selected_exercise_num');
      } catch {}
    }
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDaySelect = (dayId: string) => {
    setSelectedDayId(dayId);
    try {
      sessionStorage.setItem('nexus_selected_day_id', dayId);
    } catch {}
  };

  const handleExerciseSelect = (ex: ExerciseDetail | null) => {
    setSelectedExerciseDetail(ex);
    try {
      if (ex) {
        sessionStorage.setItem('nexus_selected_exercise_num', String(ex.num));
      } else {
        sessionStorage.removeItem('nexus_selected_exercise_num');
      }
    } catch {}
  };

  const handleOpenTimer = (
    seconds: number = 60,
    name: string = '',
    autoStart: boolean = false,
    keepMinimized: boolean = false
  ) => {
    setTimerSeconds(seconds);
    setTimerExerciseName(name);
    setIsTimerOpen(true);
    setIsTimerMinimized(keepMinimized);
    setTimerTrigger({ id: Date.now(), autoStart });
  };

  const handleHeaderTimerClick = () => {
    if (!isTimerOpen) {
      setIsTimerOpen(true);
      setIsTimerMinimized(false);
    } else if (isTimerMinimized) {
      // If minimized, clicking header button maximizes the modal!
      setIsTimerMinimized(false);
    } else {
      // If already maximized, minimize it
      setIsTimerMinimized(true);
    }
  };

  const handleBackToWorkout = () => {
    handleTabChange('today', true);
    handleExerciseSelect(null);
  };

  // 1. Initial seamless loading state (prevents lock screen flash)
  if (authState === 'checking') {
    return <div className="min-h-screen bg-slate-950" />;
  }

  // 2. Locked state
  if (authState === 'locked') {
    return <AuthLock onUnlock={() => setAuthState('unlocked')} />;
  }

  // 3. Unlocked App View
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 animate-fadeIn">
      {/* Sticky Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => handleTabChange(tab, false)}
        onOpenTimer={handleHeaderTimerClick}
        timerRunning={isTimerRunning}
        onLock={handleLockApp}
      />

      {/* Main Body Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-8">
        {activeTab === 'today' && (
          <DayWorkoutView
            selectedDayId={selectedDayId}
            setSelectedDayId={handleDaySelect}
            onOpenTimer={handleOpenTimer}
          />
        )}

        {activeTab === 'night' && <NightRoutineView />}

        {activeTab === 'progression' && <ProgressionView />}

        {activeTab === 'library' && (
          <ExerciseLibraryView
            onOpenTimer={handleOpenTimer}
            selectedExercise={selectedExerciseDetail}
            onClearSelectedExercise={() => handleExerciseSelect(null)}
            onSelectExercise={(ex) => handleExerciseSelect(ex)}
            onBackToWorkout={handleBackToWorkout}
            currentWorkoutDayName={`Day ${currentDay.dayNumber} (${currentDay.title})`}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentDayId={currentDay.id}
            currentDayTitle={`Day ${currentDay.dayNumber}: ${currentDay.title}`}
            onLockApp={handleLockApp}
          />
        )}
      </main>

      {/* Integrated Workout Timer, Stopwatch & Clock Modal Suite */}
      <WorkoutTimerModal
        isOpen={isTimerOpen}
        isMinimized={isTimerMinimized}
        setIsMinimized={setIsTimerMinimized}
        onOpen={() => {
          setIsTimerOpen(true);
          setIsTimerMinimized(false);
        }}
        onClose={() => {
          setIsTimerOpen(false);
          setIsTimerMinimized(false);
        }}
        initialSeconds={timerSeconds}
        exerciseName={timerExerciseName}
        onTimerStateChange={setIsTimerRunning}
        trigger={timerTrigger}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => handleTabChange(tab, true)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
