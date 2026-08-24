'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DayWorkoutView from '@/components/DayWorkoutView';
import WeeklyScheduleView from '@/components/WeeklyScheduleView';
import NightRoutineView from '@/components/NightRoutineView';
import ProgressionView from '@/components/ProgressionView';
import GlossaryView from '@/components/GlossaryView';
import ExerciseLibraryView from '@/components/ExerciseLibraryView';
import RestTimerModal from '@/components/RestTimerModal';
import Footer from '@/components/Footer';
import { ExerciseDetail, WORKOUT_DAYS } from '@/data/workoutData';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');

  // Rest Timer State
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerExerciseName, setTimerExerciseName] = useState<string>('');

  // Focused Exercise in Library
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<ExerciseDetail | null>(null);

  // Return Scroll & Highlight Target
  const [highlightedExerciseNum, setHighlightedExerciseNum] = useState<number | null>(null);

  const currentDay = WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  const handleOpenTimer = (seconds: number = 60, name: string = '') => {
    setTimerSeconds(seconds);
    setTimerExerciseName(name);
    setIsTimerOpen(true);
  };

  const handleSelectDayFromSchedule = (dayId: string) => {
    setSelectedDayId(dayId);
    setActiveTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToExerciseGuide = (exercise: ExerciseDetail) => {
    setSelectedExerciseDetail(exercise);
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWorkout = (exerciseNum?: number) => {
    setActiveTab('today');
    setSelectedExerciseDetail(null);

    const targetNum = exerciseNum || selectedExerciseDetail?.num;
    if (targetNum) {
      setHighlightedExerciseNum(targetNum);
      
      // Allow tab switch to mount DOM, then scroll smoothly
      setTimeout(() => {
        const el = document.getElementById(`workout-exercise-${targetNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);

      // Clear highlight glow after 3 seconds
      setTimeout(() => {
        setHighlightedExerciseNum(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* 1. Sticky Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') {
            setSelectedExerciseDetail(null);
          }
        }}
        onOpenTimer={handleOpenTimer}
      />

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-8">
        {activeTab === 'today' && (
          <DayWorkoutView
            selectedDayId={selectedDayId}
            setSelectedDayId={setSelectedDayId}
            onOpenTimer={handleOpenTimer}
            onSelectExerciseDetail={handleNavigateToExerciseGuide}
            highlightedExerciseNum={highlightedExerciseNum}
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

      {/* 3. Floating Rest Timer Modal */}
      <RestTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        initialSeconds={timerSeconds}
        exerciseName={timerExerciseName}
      />

      {/* 4. Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'library') {
            setSelectedExerciseDetail(null);
          }
        }}
      />

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
