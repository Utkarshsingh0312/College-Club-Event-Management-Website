import React from 'react';

export const CATEGORIES = [
  'All',
  'Technical',
  'Workshop',
  'Cultural',
  'Sports',
  'Competition',
  'Seminar',
];

export const CategoryFilter = ({
  selectedCategory = 'All',
  onSelectCategory,
  categoryCounts = {},
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        const count = categoryCounts[category];

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isSelected
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{category}</span>
            {count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
