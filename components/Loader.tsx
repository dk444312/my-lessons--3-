
import React from 'react';

const Loader: React.FC = () => {
  const appName = "My Lessons";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-2">
          {appName.split("").map((letter, index) => (
            <span
              key={index}
              className="text-4xl md:text-6xl font-bold text-sky-400"
              style={{ animationDelay: `${index * 0.1}s`, animation: `bounce-letter 1.5s ease-in-out ${index * 0.1}s infinite` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
        <p className="mt-4 text-slate-400 animate-pulse">Loading your knowledge base...</p>
      </div>
    </div>
  );
};

export default Loader;
