import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { useItems } from '../hooks/useItems';
import { useSavedStore } from '../store/useSavedStore';
import { ItemCard } from '../components/ItemCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorAlert } from '../components/ErrorAlert';

export const SavedItemsPage: React.FC = () => {
  const { data: allItems, isLoading, isError, refetch } = useItems();
  const { savedIds, clearAllSaved } = useSavedStore();

  // กรองเฉพาะสิ่งของที่อยู่ใน Zustand savedIds
  const savedItems = useMemo(() => {
    if (!allItems) return [];
    return allItems.filter((item) => savedIds.includes(item.id));
  }, [allItems, savedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-base-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Saved Items & Bookmarks
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Items saved in your browser's persistent storage. Managed by Zustand Persist and TanStack Query Cache.
          </p>
        </div>

        {savedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAllSaved}
            className="btn btn-sm btn-outline btn-error"
          >
            Clear All Bookmarks
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Error Alert */}
      {isError && <ErrorAlert onRetry={() => refetch()} />}

      {/* Content Grid */}
      {!isLoading && !isError && (
        <div className="mt-8">
          {savedItems.length === 0 ? (
            <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-300">
              <div className="text-5xl mb-3">🔖</div>
              <h2 className="text-xl font-bold text-base-content">No Saved Items Yet</h2>
              <p className="text-sm text-base-content/60 mt-1 max-w-md mx-auto">
                Click the bookmark button on any item card in the Explore page to keep track of lost or found belongings.
              </p>
              <Link to="/" className="btn btn-primary btn-sm mt-5">
                Explore Items Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};