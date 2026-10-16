import React, { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems";
import { ItemCard } from "../components/ItemCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { ErrorAlert } from "../components/ErrorAlert";
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from "../types/item";

export const ExplorePage: React.FC = () => {
  const { data: items, isLoading, isError, refetch } = useItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Lost" | "Found">(
    "All",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [onlyCentralRoom, setOnlyCentralRoom] = useState<boolean>(false);

  // กรองข้อมูลตามเงื่อนไขทั้งหมด
  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedType === "All" || item.type === selectedType;
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchLocation =
        selectedLocation === "All" || item.location === selectedLocation;
      const matchCentral =
        !onlyCentralRoom ||
        item.custody === "Central Lost & Found Room (Building A6 First Floor)";

      return (
        matchSearch &&
        matchType &&
        matchCategory &&
        matchLocation &&
        matchCentral
      );
    });
  }, [
    items,
    searchTerm,
    selectedType,
    selectedCategory,
    selectedLocation,
    onlyCentralRoom,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 pt-4">
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">
          Bangkok University Community Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Find What You Lost, <br className="hidden sm:inline" />
          <span className="text-blue-600">Help What You Found</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
          Centralized lost & found platform for campus buildings, study rooms,
          and facilities.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search items by name, keywords, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(["All", "Lost", "Found"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Location Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Quick Filter: Central Lost & Found Room */}
          <button
            type="button"
            onClick={() => setOnlyCentralRoom(!onlyCentralRoom)}
            className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
              onlyCentralRoom
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🏢 Central Room (A6) Only
          </button>
        </div>
      </div>

      {/* Loading State: Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Error State with Retry Button */}
      {isError && <ErrorAlert onRetry={() => refetch()} />}

      {/* Items Grid */}
      {!isLoading && !isError && (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-base-content/70">
              Showing {filteredItems.length} items
            </span>
            {(searchTerm ||
              selectedType !== "All" ||
              selectedCategory !== "All" ||
              selectedLocation !== "All" ||
              onlyCentralRoom) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                  setSelectedCategory("All");
                  setSelectedLocation("All");
                  setOnlyCentralRoom(false);
                }}
                className="btn btn-ghost btn-xs text-primary"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-base-100 rounded-2xl border border-dashed border-base-300">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-base-content">
                No Items Found
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Try adjusting your search keywords or filter options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
