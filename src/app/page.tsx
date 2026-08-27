'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DayWorkoutView from '@/components/DayWorkoutView';
import AuthLock from '@/components/AuthLock';
import Footer from '@/components/Footer';
import { ExerciseDetail, WORKOUT_DAYS, EXERCISE_DATABASE } from '@/data/workoutData';
import { formatLocalDateKey, WorkoutHistoryEntry, HISTORY_STORAGE_KEY } from '@/components/WorkoutCalendarView';

import NightRoutineView from '@/components/NightRoutineView';
import ProgressionView from '@/components/ProgressionView';
import ExerciseLibraryView from '@/components/ExerciseLibraryView';
import SettingsView from '@/components/SettingsView';
import WorkoutTimerModal from '@/components/WorkoutTimerModal';

// Helper to determine the next training day in sequence based on completed workout logs
const getAutoRecommendedDayId = (): string => {
  try {
    const todayStr = formatLocalDateKey(new Date());
    const savedDayId = sessionStorage.getItem('nexus_selected_day_id');
    const savedDayDate = sessionStorage.getItem('nexus_selected_day_date');

    // If user explicitly picked a day today in the current active session, keep it
    if (savedDayId && savedDayDate === todayStr) {
      return savedDayId;
    }

    const rawHist = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!rawHist) return 'day-1';

    const history: Record<string, WorkoutHistoryEntry> = JSON.parse(rawHist);
    const entries = Object.values(history).filter(
      (h) => h.completedSetsCount >= h.totalSetsCount || h.completedSetsCount >= 10
    );

    if (entries.length === 0) return 'day-1';

    // Sort descending by date & timestamp to find latest completed routine
    entries.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        b.timestamp - a.timestamp
    );

    const lastLog = entries[0];

    // If the last completed workout was logged on a previous day,
    // automatically advance to the next workout in the 7-day PPL sequence!
    if (lastLog.date !== todayStr) {
      const nextDayNumber = (lastLog.dayNumber % 7) + 1;
      return `day-${nextDayNumber}`;
    }

    return lastLog.dayId || 'day-1';
  } catch {
    return 'day-1';
  }
};

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

      // Automatically determine and select the appropriate workout day
      const autoDayId = getAutoRecommendedDayId();
      setSelectedDayId(autoDayId);

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

  const isSwitchingTabRef = React.useRef<boolean>(false);

  // 2. Persist & Restore Scroll Position per tab
  useEffect(() => {
    const handleScroll = () => {
      if (isSwitchingTabRef.current) return;
      try {
        sessionStorage.setItem(`nexus_scroll_${activeTab}`, String(window.scrollY));
      } catch {}
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  const handleLockApp = () => {
    localStorage.removeItem('nexus_auth_session');
    sessionStorage.removeItem('nexus_auth_session');
    setAuthState('locked');
  };

  const handleTabChange = (tab: string, shouldScrollToTop: boolean = false) => {
    // 1. Save current tab's scroll position before leaving
    try {
      sessionStorage.setItem(`nexus_scroll_${activeTab}`, String(window.scrollY));
    } catch {}

    // 2. Lock scroll listener during transition
    isSwitchingTabRef.current = true;

    // 3. Determine target scroll position (0 if unvisited or explicitly scrolling to top)
    let targetY = 0;
    if (!shouldScrollToTop) {
      try {
        const saved = sessionStorage.getItem(`nexus_scroll_${tab}`);
        if (saved) {
          targetY = Math.max(0, parseInt(saved, 10) || 0);
        }
      } catch {}
    }

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

    // 4. Scroll window to target position (0 if fresh/unvisited tab, exact Y if visited)
    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
        isSwitchingTabRef.current = false;
      }, 50);
    });
  };

  const handleDaySelect = (dayId: string) => {
    setSelectedDayId(dayId);
    try {
      const todayStr = formatLocalDateKey(new Date());
      sessionStorage.setItem('nexus_selected_day_id', dayId);
      sessionStorage.setItem('nexus_selected_day_date', todayStr);
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
