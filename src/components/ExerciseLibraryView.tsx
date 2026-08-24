'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { EXERCISE_DATABASE, ExerciseDetail } from '@/data/workoutData';
import {
  Search,
  Dumbbell,
  Tag,
  Target,
  Sparkles,
  Timer,
  X,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  onOpenTimer?: (seconds: number, name: string) => void;
  selectedExercise?: ExerciseDetail | null;
  onClearSelectedExercise?: () => void;
  onBackToWorkout?: (exerciseNum?: number) => void;
  currentWorkoutDayName?: string;
}

export default function ExerciseLibraryView({
  onOpenTimer,
  selectedExercise = null,
  onClearSelectedExercise,
  onBackToWorkout,
  currentWorkoutDayName = 'Workout',
}: ExerciseLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'push' | 'pull' | 'legs-core' | 'daily'>('all');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All 40 Exercises' },
    { id: 'push', label: 'Push (Chest/Delts/Triceps)' },
    { id: 'pull', label: 'Pull (Back/Biceps/Rear Delts)' },
    { id: 'legs-core', label: 'Legs & Core' },
    { id: 'daily', label: 'Daily Mobility' },
  ];

  // If a specific exercise was selected, auto-scroll to it smoothly
  useEffect(() => {
    if (selectedExercise) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`exercise-guide-${selectedExercise.num}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedExercise]);

  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => {
      // If a specific exercise is passed, prioritize it
      if (selectedExercise && ex.num === selectedExercise.num) {
        return true;
      }

      const matchesSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.secondary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.cue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        activeCategory === 'all' || ex.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory, selectedExercise]);

  return (
    <div className="space-y-6">
      {/* 1. Sticky / Prominent Back-to-Workout Bar (Mobile First) */}
      {onBackToWorkout && (
        <div className="sticky top-16 sm:top-20 z-30 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-2">
          <div className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500/60 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <button
              onClick={() => onBackToWorkout(selectedExercise?.num)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to {currentWorkoutDayName}</span>
            </button>

            {selectedExercise ? (
              <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
                <span className="hidden xs:inline text-indigo-400 font-semibold">Viewing:</span>
                <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[240px]">
                  #{selectedExercise.num} {selectedExercise.name}
                </span>
                {onClearSelectedExercise && (
                  <button
                    onClick={onClearSelectedExercise}
                    className="text-xs text-slate-400 hover:text-white underline ml-1"
                  >
                    View All
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                40 Form &amp; Execution Guides
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Header & Search Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Complete Exercise Execution &amp; Form Guide
              </h2>
              <p className="text-xs text-slate-400">
                Step-by-step biomechanics, target muscles &amp; mind-muscle cues for all 40 movements
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise, muscle, or cue..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (onClearSelectedExercise) onClearSelectedExercise();
                setActiveCategory(cat.id as typeof activeCategory);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeCategory === cat.id && !selectedExercise
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cards Grid / List */}
      <div className="space-y-6">
        {filteredExercises.map((ex: ExerciseDetail) => {
          const isFocused = selectedExercise?.num === ex.num;

          return (
            <div
              key={ex.num}
              id={`exercise-guide-${ex.num}`}
              className={`overflow-hidden rounded-3xl bg-slate-900 border-2 transition-all shadow-xl ${
                isFocused
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-950/50'
                  : 'border-indigo-600/40 hover:border-indigo-500'
              }`}
            >
              {/* Card Header (OneNote styled Blue Bar) */}
              <div className="bg-indigo-600 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-white/20 text-white text-xs font-black flex items-center justify-center backdrop-blur-sm">
                    {ex.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {ex.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-900/80 text-white border border-indigo-400/40 whitespace-nowrap shadow-sm">
                    {ex.tag}
                  </span>

                  {onBackToWorkout && (
                    <button
                      onClick={() => onBackToWorkout(ex.num)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition active:scale-95"
                      title="Return to workout at this exercise"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Workout
                    </button>
                  )}

                  {onOpenTimer && (
                    <button
                      onClick={() => onOpenTimer(60, ex.name)}
                      className="p-1.5 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-white border border-indigo-400/40 transition active:scale-95"
                      title="Start rest timer for this exercise"
                    >
                      <Timer className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7 space-y-5 bg-slate-950/60">
                {/* Demonstration Visual */}
                <div
                  onClick={() => setEnlargedImage(ex.image)}
                  className="relative cursor-pointer group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-3 hover:border-indigo-500/50 transition shadow-inner"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="max-h-72 w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-[10px] text-slate-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Tap to Enlarge
                  </div>
                </div>

                {/* Targeted Muscles breakdown */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-rose-400" />
                    Targeted Muscles
                  </h4>
                  <div className="space-y-1 text-slate-300">
                    <p>
                      <strong className="text-indigo-400">Primary:</strong> {ex.primary}
                    </p>
                    <p>
                      <strong className="text-slate-400">Secondary:</strong> {ex.secondary}
                    </p>
                  </div>
                </div>

                {/* How to Perform Instructions */}
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    📋 How to Perform (Form &amp; Tempo)
                  </h4>
                  <ol className="space-y-2 text-xs sm:text-sm text-slate-300 list-decimal list-inside pl-1 leading-relaxed">
                    {ex.steps.map((step, idx) => (
                      <li key={idx} className="marker:text-indigo-400 marker:font-bold">
                        {step.replace(/<\/?strong>/g, '')}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Mind-Muscle Connection Box (Mint Green Card) */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border-l-4 border-l-emerald-500 border border-slate-800 text-xs sm:text-sm">
                  <strong className="text-emerald-300 block font-bold mb-1">
                    🧠 Mind-Muscle Connection (What to Think):
                  </strong>
                  <p className="text-emerald-100/90 italic leading-relaxed">
                    &ldquo;{ex.cue}&rdquo;
                  </p>
                </div>

                {/* Bottom Back to Workout Action */}
                {onBackToWorkout && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onBackToWorkout(ex.num)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 hover:text-white font-bold text-xs active:scale-95 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Return to {currentWorkoutDayName}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredExercises.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-sm">
            No exercises found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

      {/* Enlarged Image Lightbox Modal */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 p-2 rounded-3xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-600 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlargedImage}
              alt="Enlarged exercise preview"
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
