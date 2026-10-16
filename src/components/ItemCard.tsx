import React from 'react';
import { Link } from 'react-router';
import type { LostFoundItem } from '../types/item';
import { useSavedStore } from '../store/useSavedStore';
import { CategoryIcon } from './CategoryIcon';

interface ItemCardProps {
  item: LostFoundItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { isSaved, toggleSave } = useSavedStore();
  const saved = isSaved(item.id);
  const isAtCentral = item.custody === 'Central Lost & Found Room (Building A6 First Floor)';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* รูปภาพ หรือ Category Placeholder */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <CategoryIcon category={item.category} size="lg" />
              <span className="text-[11px] text-slate-400 mt-2 font-medium">No Image Uploaded</span>
            </div>
          )}

          {/* Type Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm tracking-wide uppercase ${
                item.type === 'Lost'
                  ? 'bg-rose-500'
                  : 'bg-emerald-600'
              }`}
            >
              {item.type}
            </span>
            {item.status === 'Resolved' && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                Resolved
              </span>
            )}
          </div>

          {/* Save / Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleSave(item.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center absolute top-3 right-3 shadow-md backdrop-blur-md transition-transform active:scale-90 ${
              saved
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Item'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill={saved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
              {item.category}
            </span>
            <span>•</span>
            <span>{item.date}</span>
          </div>

          <h2 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h2>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="text-blue-500 shrink-0">📍</span>
            <span className="truncate">{item.location}</span>
          </div>

          {isAtCentral && (
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-md">
                🏢 Central Room (A3)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Button Action */}
      <div className="p-4 sm:p-5 pt-0">
        <Link
          to={`/items/${item.id}`}
          className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-1"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};