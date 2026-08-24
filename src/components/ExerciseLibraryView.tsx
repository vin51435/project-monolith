'use client';

import React, { useState, useMemo } from 'react';
import { EXERCISE_DATABASE, ExerciseDetail } from '@/data/workoutData';
import {
  Search,
  Dumbbell,
  Tag,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Timer,
  X,
  Flame
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  onOpenTimer?: (seconds: number, name: string) => void;
  selectedExercise?: ExerciseDetail | null;
  onClearSelectedExercise?: () => void;
}

export default function ExerciseLibraryView({
  onOpenTimer,
  selectedExercise = null,
  onClearSelectedExercise,
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

  const filteredExercises = useMemo(() => {
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
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters */}
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
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
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

      {/* 2. Focused Exercise Notice if navigated from workout */}
      {selectedExercise && (
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              Showing details for <strong>{selectedExercise.name}</strong>
            </span>
          </div>
          {onClearSelectedExercise && (
            <button
              onClick={onClearSelectedExercise}
              className="text-xs text-indigo-300 hover:text-white font-bold px-2 py-1 bg-indigo-900/60 rounded-lg"
            >
              Show All
            </button>
          )}
        </div>
      )}

      {/* 3. Cards Grid / List */}
      <div className="space-y-6">
        {filteredExercises.map((ex: ExerciseDetail) => (
          <div
            key={ex.num}
            id={`exercise-${ex.num}`}
            className="overflow-hidden rounded-3xl bg-slate-900 border-2 border-indigo-600/40 hover:border-indigo-500 shadow-xl transition-all"
          >
            {/* Card Header (OneNote styled Blue Bar) */}
            <div className="bg-indigo-600 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white text-xs font-black flex items-center justify-center backdrop-blur-sm">
                  {ex.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {ex.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-900/80 text-white border border-indigo-400/40 whitespace-nowrap shadow-sm">
                  {ex.tag}
                </span>
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
            </div>
          </div>
        ))}

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
