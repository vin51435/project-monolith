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
  Flame,
  Dumbbell,
  Lightbulb,
  Sparkles,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  X
} from 'lucide-react';

interface DayWorkoutViewProps {
  selectedDayId: string;
  setSelectedDayId: (id: string) => void;
  onOpenTimer: (seconds: number, name: string) => void;
}

export default function DayWorkoutView({
  selectedDayId,
  setSelectedDayId,
  onOpenTimer,
}: DayWorkoutViewProps) {
  // Store completed sets: key format `dayId-exerciseNum-setIndex`
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  
  // Track which exercise cards are expanded inline
  const [expandedExerciseNum, setExpandedExerciseNum] = useState<number | null>(null);

  // Enlarged Image modal lightbox state
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const currentDay: WorkoutDay =
    WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  const toggleExpand = (exNum: number) => {
    setExpandedExerciseNum((prev) => (prev === exNum ? null : exNum));
  };

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
    <div className="space-y-5 sm:space-y-6">
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
                onClick={() => {
                  setSelectedDayId(day.id);
                  setExpandedExerciseNum(null);
                }}
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-4 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                ~60 Min Workout
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
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
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Workout Progress
                </div>
                <div className="text-base sm:text-lg font-black text-indigo-400">
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
          <div className="relative z-10 mt-4 p-3 sm:p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-start gap-2.5 sm:gap-3">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-indigo-200 uppercase tracking-wider">
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

      {/* 4. WORKOUT EXERCISE CARDS (WITH INLINE DROPDOWN GUIDE) */}
      {!currentDay.isRest && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-indigo-400" />
              Prescribed Sequence ({currentDay.exercises.length} Exercises)
            </h3>
            <span className="text-[11px] sm:text-xs text-indigo-300 font-medium hidden xs:inline">
              Tap card for form guide
            </span>
          </div>

          {currentDay.exercises.map((ex: DayExercise) => {
            const exDetail = EXERCISE_DATABASE.find(
              (d) => d.num === ex.exerciseId || d.name.toLowerCase() === ex.name.toLowerCase()
            );
            const isExpanded = expandedExerciseNum === ex.num;
            const match = ex.rest.match(/(\d+)/);
            const restSec = match ? parseInt(match[1], 10) : 60;

            return (
              <div
                key={ex.num}
                id={`workout-exercise-${ex.num}`}
                className={`bg-slate-900 border rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 transition-all shadow-md space-y-3 ${
                  isExpanded
                    ? 'border-indigo-500/80 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
              >
                {/* Exercise Header: Click to Toggle Inline Guide Dropdown */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => toggleExpand(ex.num)}
                    className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 cursor-pointer group"
                    title={isExpanded ? 'Click to hide details' : 'Click to show form guide'}
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white border border-indigo-500/30 text-indigo-400 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 transition">
                      {ex.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition tracking-tight flex items-center gap-1.5">
                        <span className="truncate">{ex.name}</span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                        <span className="text-slate-300 font-medium">Target:</span> {ex.target}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Dropdown Button */}
                  {exDetail && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(ex.num)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl border shadow-sm shrink-0 transition active:scale-95 ${
                        isExpanded
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-800/60'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide' : 'Form'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* INLINE EXPANDED FORM GUIDE DROPDOWN */}
                {isExpanded && exDetail && (
                  <div className="pt-3 pb-1 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    {/* Demonstration Visual */}
                    <div
                      onClick={() => setEnlargedImage(exDetail.image)}
                      className="relative cursor-pointer group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2 hover:border-indigo-500/50 transition shadow-inner"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exDetail.image}
                        alt={exDetail.name}
                        className="max-h-56 sm:max-h-64 w-auto max-w-full object-contain rounded-xl"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] text-slate-300 font-semibold border border-slate-700">
                        Tap to Enlarge
                      </span>
                    </div>

                    {/* Targeted Muscles Breakdown */}
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
                      <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1 text-indigo-400">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        Targeted Muscles
                      </h5>
                      <p className="text-slate-300">
                        <strong className="text-white">Primary:</strong> {exDetail.primary}
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        <strong className="text-slate-300">Secondary:</strong> {exDetail.secondary}
                      </p>
                    </div>

                    {/* How to Perform Instructions */}
                    <div className="space-y-1.5">
                      <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-300">
                        📋 How to Perform
                      </h5>
                      <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside pl-0.5 leading-relaxed">
                        {exDetail.steps.map((step, idx) => (
                          <li key={idx} className="marker:text-indigo-400 marker:font-bold">
                            {step.replace(/<\/?strong>/g, '')}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Mind-Muscle Cue Card */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border-l-4 border-l-emerald-500 border border-slate-800 text-xs">
                      <strong className="text-emerald-300 block font-bold mb-0.5">
                        🧠 Mind-Muscle Connection:
                      </strong>
                      <p className="text-emerald-100/90 italic leading-relaxed">
                        &ldquo;{exDetail.cue}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {/* Integrated Metrics & Set Tracker Tray (Single row on desktop, 2-tier on mobile) */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  {/* Left: Target Reps & Rest Timer Button */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 text-xs shrink-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Reps:
                      </span>
                      <span className="font-bold text-white text-xs">
                        {ex.reps}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTimer(restSec, ex.name)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 text-xs font-bold active:scale-95 transition"
                      title="Click to start rest timer"
                    >
                      <Timer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Rest {ex.rest}</span>
                    </button>
                  </div>

                  {/* Right: Interactive Sets Checklist Buttons (Inline row on sm/desktop, grid on mobile) */}
                  <div
                    className={`grid gap-1.5 sm:flex sm:items-center ${
                      ex.sets === 4
                        ? 'grid-cols-4'
                        : ex.sets === 3
                        ? 'grid-cols-3'
                        : 'grid-cols-2'
                    }`}
                  >
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
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-xl border text-xs font-bold transition active:scale-95 sm:min-w-[76px] ${
                            isDone
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-600/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                          title={`Mark Set ${setIdx + 1} Done`}
                        >
                          <span>Set {setIdx + 1}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enlarged Image Lightbox */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-slate-800 text-white rounded-full border border-slate-600 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlargedImage}
              alt="Enlarged exercise preview"
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
