'use client';

import React, { useState, useMemo } from 'react';
import { GLOSSARY_TERMS, GlossaryTerm } from '@/data/workoutData';
import { BookOpen, Search, Filter, Sparkles, Tag } from 'lucide-react';

export default function GlossaryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'metric', label: 'Sets & Reps' },
    { id: 'split', label: 'PPL Split' },
    { id: 'biomechanics', label: 'Biomechanics' },
    { id: 'technique', label: 'Technique' },
    { id: 'exercise', label: 'Exercises' },
  ];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Workout Terminology &amp; Key Concepts
              </h2>
              <p className="text-xs text-slate-400">
                Glossary of scientific &amp; practical lifting terminology
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search definitions..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Term Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {filteredTerms.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-indigo-300 tracking-tight flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  {item.term}
                </h4>
                {item.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500 text-xs sm:text-sm">
              No glossary terms found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
