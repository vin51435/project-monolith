'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DayWorkoutView from '@/components/DayWorkoutView';
import WeeklyScheduleView from '@/components/WeeklyScheduleView';
import NightRoutineView from '@/components/NightRoutineView';
import ProgressionView from '@/components/ProgressionView';
import GlossaryView from '@/components/GlossaryView';
import ExerciseLibraryView from '@/components/ExerciseLibraryView';
import WorkoutTimerModal from '@/components/WorkoutTimerModal';
import AuthLock from '@/components/AuthLock';
import Footer from '@/components/Footer';
import { ExerciseDetail, WORKOUT_DAYS } from '@/data/workoutData';

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

  // Exercise Library Selection State
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<ExerciseDetail | null>(null);

  const currentDay = WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  // Check saved session on mount
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem('nexus_auth_session') === 'active';
      const isSessionActive = sessionStorage.getItem('nexus_auth_session') === 'active';
      if (isRemembered || isSessionActive) {
        setAuthState('unlocked');
      } else {
        setAuthState('locked');
      }
    } catch {
      setAuthState('locked');
    }
  }, []);

  const handleLockApp = () => {
    localStorage.removeItem('nexus_auth_session');
    sessionStorage.removeItem('nexus_auth_session');
    setAuthState('locked');
  };

  const handleOpenTimer = (seconds: number = 60, name: string = '') => {
    setTimerSeconds(seconds);
    setTimerExerciseName(name);
    setIsTimerOpen(true);
    setIsTimerMinimized(false);
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

  const handleSelectDayFromSchedule = (dayId: string) => {
    setSelectedDayId(dayId);
    setActiveTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWorkout = () => {
    setActiveTab('today');
    setSelectedExerciseDetail(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') {
            setSelectedExerciseDetail(null);
          }
        }}
        onOpenTimer={handleHeaderTimerClick}
        timerRunning={isTimerRunning}
        onLock={handleLockApp}
      />

      {/* Main Body Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-8">
        {activeTab === 'today' && (
          <DayWorkoutView
            selectedDayId={selectedDayId}
            setSelectedDayId={setSelectedDayId}
            onOpenTimer={handleOpenTimer}
          />
        )}

        {activeTab === 'schedule' && (
          <WeeklyScheduleView onSelectDay={handleSelectDayFromSchedule} />
        )}

        {activeTab === 'night' && <NightRoutineView />}

        {activeTab === 'progression' && <ProgressionView />}

        {activeTab === 'glossary' && <GlossaryView />}

        {activeTab === 'library' && (
          <ExerciseLibraryView
            onOpenTimer={handleOpenTimer}
            selectedExercise={selectedExerciseDetail}
            onClearSelectedExercise={() => setSelectedExerciseDetail(null)}
            onSelectExercise={(ex) => setSelectedExerciseDetail(ex)}
            onBackToWorkout={handleBackToWorkout}
            currentWorkoutDayName={`Day ${currentDay.dayNumber} (${currentDay.title})`}
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
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') {
            setSelectedExerciseDetail(null);
          }
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
