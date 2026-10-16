import React from 'react';

interface ErrorAlertProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message = 'Failed to load items. Please check your network connection or backend server.',
  onRetry,
}) => {
  return (
    <div className="alert alert-error shadow-lg my-6 max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onRetry} className="btn btn-sm btn-outline btn-neutral bg-base-100 hover:bg-base-200 whitespace-nowrap">
        Try Again (Retry)
      </button>
    </div>
  );
};