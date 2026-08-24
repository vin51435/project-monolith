'use client';

import React, { useState } from 'react';
import {
  WORKOUT_DAYS,
  WorkoutDay,
  DayExercise,
  EXERCISE_DATABASE,
  ExerciseDetail
} from '@/data/workoutData';
import {
  CheckCircle2,
  Circle,
  Timer,
  Info,
  ChevronRight,
  Flame,
  Dumbbell,
  Lightbulb,
  Sparkles,
  RefreshCw,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface DayWorkoutViewProps {
  selectedDayId: string;
  setSelectedDayId: (id: string) => void;
  onOpenTimer: (seconds: number, name: string) => void;
  onSelectExerciseDetail?: (exercise: ExerciseDetail) => void;
  highlightedExerciseNum?: number | null;
}

export default function DayWorkoutView({
  selectedDayId,
  setSelectedDayId,
  onOpenTimer,
  onSelectExerciseDetail,
  highlightedExerciseNum = null,
}: DayWorkoutViewProps) {
  // Store completed sets: key format `dayId-exerciseNum-setIndex`
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const currentDay: WorkoutDay =
    WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  const toggleSet = (dayId: string, exNum: number, setIndex: number, restString: string, exName: string) => {
    const key = `${dayId}-${exNum}-${setIndex}`;
    const willBeChecked = !completedSets[key];
    
    setCompletedSets((prev) => ({
      ...prev,
      [key]: willBeChecked,
    }));

    // If newly completed, parse rest seconds and offer/auto-start timer
    if (willBeChecked) {
      const match = restString.match(/(\d+)/);
      const restSec = match ? parseInt(match[1], 10) : 60;
      onOpenTimer(restSec, exName);
    }
  };

  const resetDayProgress = (dayId: string) => {
    setCompletedSets((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${dayId}-`)) {
          delete next[k];
        }
      });
      return next;
    });
  };

  const getDayCompletedCount = (day: WorkoutDay) => {
    if (day.isRest || !day.exercises) return 0;
    let count = 0;
    day.exercises.forEach((ex) => {
      for (let i = 0; i < ex.sets; i++) {
        if (completedSets[`${day.id}-${ex.num}-${i}`]) {
          count++;
        }
      }
    });
    return count;
  };

  const getDayTotalSets = (day: WorkoutDay) => {
    if (day.isRest || !day.exercises) return 0;
    return day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  };

  const completedSetsCount = getDayCompletedCount(currentDay);
  const totalSetsCount = getDayTotalSets(currentDay);
  const progressPercent = totalSetsCount > 0 ? (completedSetsCount / totalSetsCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 1. Day Selector Carousel / Pills */}
      <div className="bg-slate-950/80 p-2 sm:p-3 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Training Day
          </span>
          <span className="text-xs font-semibold text-indigo-400">
            Day {currentDay.dayNumber} of 7
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
          {WORKOUT_DAYS.map((day) => {
            const isSelected = day.id === currentDay.id;
            const completed = getDayCompletedCount(day);
            const total = getDayTotalSets(day);
            const isDayDone = total > 0 && completed === total;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition active:scale-95 text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-bold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 font-medium'
                }`}
              >
                <span className="text-[11px] sm:text-xs opacity-80">
                  Day {day.dayNumber}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate max-w-full">
                  {day.title.split(' ')[0]}
                </span>
                {day.isRest ? (
                  <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">Rest</span>
                ) : (
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {completed}/{total}
                  </span>
                )}
                {isDayDone && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white font-black shadow-sm">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Day Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                ~60 Min Workout
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentDay.title} &mdash; {currentDay.subtitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              Focus: <span className="text-white font-semibold">{currentDay.focus}</span>
            </p>
          </div>

          {/* Progress & Reset Action */}
          {!currentDay.isRest && (
            <div className="flex items-center sm:flex-col items-start sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="text-left sm:text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Workout Progress
                </div>
                <div className="text-lg font-black text-indigo-400">
                  {completedSetsCount} / {totalSetsCount} Sets ({Math.round(progressPercent)}%)
                </div>
              </div>
              {completedSetsCount > 0 && (
                <button
                  onClick={() => resetDayProgress(currentDay.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-400 py-1 px-2.5 rounded-xl bg-slate-800/80 border border-slate-700 transition"
                  title="Reset completed sets"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Sets
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!currentDay.isRest && totalSetsCount > 0 && (
          <div className="relative z-10 w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Technique Tip Alert */}
        {currentDay.techniqueTip && (
          <div className="relative z-10 mt-5 p-3.5 sm:p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                6 kg Key Technique
              </h4>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-0.5">
                {currentDay.techniqueTip}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. REST DAY CONTENT */}
      {currentDay.isRest && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Full Recovery &amp; Regeneration Day</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              Muscles grow during recovery, not while working out. Keep today active with light movement, clean hydration, and quality sleep.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-2xl mx-auto">
              {currentDay.restActivities?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Activity #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.activity}</h4>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 mt-2 bg-emerald-950/50 py-1 px-2.5 rounded-lg border border-emerald-800/40 inline-block w-fit">
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKOUT EXERCISE CARDS / LIST */}
      {!currentDay.isRest && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-indigo-400" />
              Prescribed Exercise Sequence ({currentDay.exercises.length} Exercises)
            </h3>
            <span className="text-xs text-indigo-300 font-medium">
              Tap title or guide for form cues
            </span>
          </div>

          {currentDay.exercises.map((ex: DayExercise) => {
            const exDetail = EXERCISE_DATABASE.find(
              (d) => d.num === ex.exerciseId || d.name.toLowerCase() === ex.name.toLowerCase()
            );
            const isTargeted = highlightedExerciseNum === ex.num;

            return (
              <div
                key={ex.num}
                id={`workout-exercise-${ex.num}`}
                className={`bg-slate-900 border rounded-3xl p-4 sm:p-5 transition-all shadow-md ${
                  isTargeted
                    ? 'target-highlight bg-slate-900/90'
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  {/* Left: Clickable Exercise Index, Title, Form Guide Trigger */}
                  <div
                    onClick={() => {
                      if (exDetail && onSelectExerciseDetail) {
                        onSelectExerciseDetail(exDetail);
                      }
                    }}
                    className="flex items-start gap-3 cursor-pointer group flex-1"
                    title="Click to open full form guide"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white border border-indigo-500/30 text-indigo-400 font-black text-sm flex items-center justify-center shrink-0 mt-0.5 transition">
                      {ex.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition tracking-tight flex items-center gap-1.5">
                          <span>{ex.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </h4>
                        {exDetail && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectExerciseDetail) {
                                onSelectExerciseDetail(exDetail);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 transition shadow-sm"
                          >
                            <BookOpen className="w-3 h-3" /> Form Guide
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="text-slate-300 font-semibold">Target:</span> {ex.target}
                      </p>
                    </div>
                  </div>

                  {/* Right: Reps, Rest, Sets Checkboxes */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    {/* Reps & Rest Target Pills */}
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Reps
                        </span>
                        <span className="text-xs font-bold text-white">
                          {ex.reps}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const match = ex.rest.match(/(\d+)/);
                          const restSec = match ? parseInt(match[1], 10) : 60;
                          onOpenTimer(restSec, ex.name);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-center active:scale-95 transition"
                        title="Click to start rest timer"
                      >
                        <span className="block text-[9px] font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-center gap-0.5">
                          <Timer className="w-2.5 h-2.5" /> Rest
                        </span>
                        <span className="text-xs font-bold text-indigo-200">
                          {ex.rest}
                        </span>
                      </button>
                    </div>

                    {/* Interactive Sets Checklist Buttons */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const setKey = `${currentDay.id}-${ex.num}-${setIdx}`;
                        const isDone = !!completedSets[setKey];

                        return (
                          <button
                            key={setIdx}
                            type="button"
                            onClick={() =>
                              toggleSet(currentDay.id, ex.num, setIdx, ex.rest, ex.name)
                            }
                            className={`flex flex-col items-center justify-center w-9 h-11 rounded-xl border font-bold text-xs transition active:scale-90 ${
                              isDone
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/20'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                            title={`Mark Set ${setIdx + 1} Done`}
                          >
                            <span className="text-[9px] opacity-70">S{setIdx + 1}</span>
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 fill-current text-white mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
