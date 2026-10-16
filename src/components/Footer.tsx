import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300 mt-auto">
      <div>
        <p className="font-semibold text-sm">
          FINDIT — Smart Lost & Found Hub for Campus Community
        </p>
        <p className="text-xs text-base-content/60 mt-1">
          Developed for CS319 Internet Programming I Mini Project 2. Built with React 19, TypeScript, TanStack Query v5 & Zustand.
        </p>
      </div>
    </footer>
  );
};