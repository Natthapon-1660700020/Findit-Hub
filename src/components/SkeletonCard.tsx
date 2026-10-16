import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200 animate-pulse overflow-hidden">
      <div className="h-48 bg-base-300 w-full" />
      <div className="card-body p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-base-300 rounded w-1/4" />
          <div className="h-5 bg-base-300 rounded w-1/4" />
        </div>
        <div className="h-6 bg-base-300 rounded w-3/4" />
        <div className="h-4 bg-base-300 rounded w-full" />
        <div className="h-4 bg-base-300 rounded w-2/3" />
        <div className="pt-3 border-t border-base-200 flex justify-between items-center">
          <div className="h-4 bg-base-300 rounded w-1/3" />
          <div className="h-8 bg-base-300 rounded w-20" />
        </div>
      </div>
    </div>
  );
};