import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getEvents } from '../utils/storage';
import { EventGrid } from '../components/events/EventGrid';
import { SearchBar } from '../components/events/SearchBar';
import { CategoryFilter } from '../components/events/CategoryFilter';
import { RegistrationModal } from '../components/events/RegistrationForm';


export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  // Registration modal states
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    const all = getEvents();
    setEvents(all);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('clubsphere_data_changed', loadData);
    return () => window.removeEventListener('clubsphere_data_changed', loadData);
  }, []);

  // Sync category param with URL if needed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: events.length };
    events.forEach((evt) => {
      counts[evt.category] = (counts[evt.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Dynamic search, filter and sort
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // 1. Dynamic Search (name, description, venue)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (evt) =>
          evt.name.toLowerCase().includes(q) ||
          (evt.description && evt.description.toLowerCase().includes(q)) ||
          (evt.venue && evt.venue.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((evt) => evt.category === selectedCategory);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'upcoming') {
        // Active/upcoming first, then by date earliest
        if (a.status === 'Completed' && b.status !== 'Completed') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return -1;
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [events, searchTerm, selectedCategory, sortBy]);

  const handleRegisterClick = (event) => {
    setSelectedEventForReg(event);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('upcoming');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
          Campus Directory
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Explore Events
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600">
          Find your next campus experience.
        </p>
      </div>

      {/* Control Bar: Search, Category Filter, and Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search events by name, description, or venue..."
          />

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="upcoming">Upcoming</option>
              <option value="date-asc">Date: Earliest</option>
              <option value="date-desc">Date: Latest</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="pt-1">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-200/80">
        <div>
          Showing <span className="text-slate-900 font-bold">{filteredEvents.length}</span> event
          {filteredEvents.length === 1 ? '' : 's'}
          {selectedCategory !== 'All' && (
            <span> in category <strong className="text-brand-600">{selectedCategory}</strong></span>
          )}
          {searchTerm && (
            <span> matching "<strong className="text-brand-600">{searchTerm}</strong>"</span>
          )}
        </div>

        {(selectedCategory !== 'All' || searchTerm) && (
          <button
            onClick={handleResetFilters}
            className="text-brand-600 hover:text-brand-700 underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Event Grid */}
      <EventGrid
        events={filteredEvents}
        isLoading={isLoading}
        onRegisterClick={handleRegisterClick}
        onResetFilters={handleResetFilters}
      />

      {/* Registration Modal */}
      {selectedEventForReg && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEventForReg(null);
          }}
          event={selectedEventForReg}
          onRegistrationSuccess={loadData}
        />
      )}
    </div>
  );
};
