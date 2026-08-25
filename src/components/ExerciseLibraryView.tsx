'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { EXERCISE_DATABASE, ExerciseDetail } from '@/data/workoutData';
import ExerciseImage from '@/components/ExerciseImage';
import {
  Search,
  Dumbbell,
  Target,
  Timer,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  onOpenTimer?: (seconds: number, name: string) => void;
  selectedExercise?: ExerciseDetail | null;
  onClearSelectedExercise?: () => void;
  onSelectExercise?: (exercise: ExerciseDetail) => void;
  onBackToWorkout?: (exerciseNum?: number) => void;
  currentWorkoutDayName?: string;
}

export default function ExerciseLibraryView({
  onOpenTimer,
  selectedExercise = null,
  onClearSelectedExercise,
  onSelectExercise,
  onBackToWorkout,
  currentWorkoutDayName = 'Workout',
}: ExerciseLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'push' | 'pull' | 'legs-core' | 'daily'>('all');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All (40)' },
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs-core', label: 'Legs & Core' },
    { id: 'daily', label: 'Daily' },
  ];

  // Prev / Next exercise for single focused mode
  const prevExercise = useMemo(() => {
    if (!selectedExercise) return null;
    return EXERCISE_DATABASE.find((e) => e.num === selectedExercise.num - 1) || null;
  }, [selectedExercise]);

  const nextExercise = useMemo(() => {
    if (!selectedExercise) return null;
    return EXERCISE_DATABASE.find((e) => e.num === selectedExercise.num + 1) || null;
  }, [selectedExercise]);

  // When selectedExercise is passed, ONLY display that single exercise
  const displayedExercises = useMemo(() => {
    if (selectedExercise) {
      return [selectedExercise];
    }

    return EXERCISE_DATABASE.filter((ex) => {
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

  // Scroll to top on single exercise change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedExercise]);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* 1. Ultra-Clean Sticky Header Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-slate-950/90 backdrop-blur-md py-2">
        <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Back to Workout button */}
          {onBackToWorkout && (
            <button
              onClick={() => onBackToWorkout(selectedExercise?.num)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm active:scale-95 transition shrink-0 shadow-md shadow-indigo-600/25"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to Workout</span>
            </button>
          )}

          {/* Right Action: Browse All or Category Title */}
          {selectedExercise ? (
            <button
              onClick={onClearSelectedExercise}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition active:scale-95 shrink-0"
              title="Browse all 40 guides"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>All Guides (40)</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-slate-400 px-2">
              {displayedExercises.length} Guides
            </span>
          )}
        </div>
      </div>

      {/* 2. Filter & Search Controls (Only shown when browsing all) */}
      {!selectedExercise && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exercise name, muscle, or cue..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Category Chips with Visible Horizontal Scrollbar */}
          <div className="flex items-center gap-1.5 custom-scrollbar-x pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Exercise Card Content */}
      <div className="space-y-4">
        {displayedExercises.map((ex: ExerciseDetail) => (
          <div
            key={ex.num}
            id={`exercise-guide-${ex.num}`}
            className="overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl"
          >
            {/* Header */}
            <div className="bg-indigo-600 px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-white/20 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {ex.num}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {ex.name}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-900/80 text-white border border-indigo-400/30 whitespace-nowrap">
                  {ex.tag.split('/')[0].trim()}
                </span>
                {onOpenTimer && (
                  <button
                    onClick={() => onOpenTimer(60, ex.name)}
                    className="p-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white border border-indigo-400/30 transition active:scale-95"
                    title="Rest Timer"
                  >
                    <Timer className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 bg-slate-950/60">
              {/* Demonstration Visual (Zero-CLS Lazy Loaded) */}
              <ExerciseImage
                src={ex.image}
                alt={ex.name}
                onEnlarge={() => setEnlargedImage(ex.image)}
              />

              {/* Targeted Muscles */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1 text-indigo-400">
                  <Target className="w-3.5 h-3.5 text-rose-400" />
                  Targeted Muscles
                </h4>
                <p className="text-slate-300">
                  <strong className="text-white">Primary:</strong> {ex.primary}
                </p>
                <p className="text-slate-400 mt-0.5">
                  <strong className="text-slate-300">Secondary:</strong> {ex.secondary}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-300">
                  📋 How to Perform
                </h4>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside pl-0.5 leading-relaxed">
                  {ex.steps.map((step, idx) => (
                    <li key={idx} className="marker:text-indigo-400 marker:font-bold">
                      {step.replace(/<\/?strong>/g, '')}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mind-Muscle Cue Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border-l-4 border-l-emerald-500 border border-slate-800 text-xs">
                <strong className="text-emerald-300 block font-bold mb-0.5">
                  🧠 Mind-Muscle Connection:
                </strong>
                <p className="text-emerald-100/90 italic leading-relaxed">
                  &ldquo;{ex.cue}&rdquo;
                </p>
              </div>

              {/* Prev / Next Bottom Navigation (In single mode) */}
              {selectedExercise && onSelectExercise && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {prevExercise ? (
                    <button
                      onClick={() => onSelectExercise(prevExercise)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold active:scale-95 transition"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>#{prevExercise.num} Prev</span>
                    </button>
                  ) : <div />}

                  {nextExercise && (
                    <button
                      onClick={() => onSelectExercise(nextExercise)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold active:scale-95 transition"
                    >
                      <span>Next #{nextExercise.num}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {displayedExercises.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-500 text-xs sm:text-sm">
            No exercises found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

      {/* Enlarged Image Lightbox */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white p-3 rounded-3xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-slate-900 text-white rounded-full border border-slate-700 shadow-xl hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlargedImage}
              alt="Enlarged exercise preview"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
