import React from 'react';
import { type Lesson } from '../types';
import { BackArrowIcon, TrashIcon } from './IconComponents';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onDelete: (lessonId: string) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onDelete }) => {

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      onDelete(lesson.id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-down">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
        >
          <BackArrowIcon className="h-5 w-5" />
          <span>All Lessons</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
          <span>Delete</span>
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-2">{lesson.title}</h1>
            <div className="flex items-baseline gap-4">
              {lesson.course && (
                  <span className="inline-block bg-slate-700 text-sky-300 text-sm font-medium mb-4 px-3 py-1 rounded-full">
                      {lesson.course}
                  </span>
              )}
               <span className="inline-block bg-slate-700 text-indigo-300 text-sm font-medium mb-4 px-3 py-1 rounded-full">
                    Week {lesson.week}
                </span>
            </div>
        </div>
        <p className="text-sm text-slate-400 mb-6 border-b border-slate-700 pb-4">
          Created on: {new Date(lesson.createdAt).toLocaleString()}
        </p>
        
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 whitespace-pre-wrap">
          <h2 className="text-2xl font-semibold border-b border-slate-600 pb-2 mb-4">Notes</h2>
          <p>{lesson.notes || "No notes have been added for this lesson."}</p>
        </div>

        {lesson.imageUrls.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold border-b border-slate-600 pb-2 mb-4">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Lesson image ${index + 1}`} className="rounded-lg object-cover w-full h-auto aspect-video" />
              ))}
            </div>
          </div>
        )}
      </div>

      {lesson.quizAttempts.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>
            <ul className="space-y-3">
              {lesson.quizAttempts.map((attempt, index) => (
                  <li key={index} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
                      <span className="font-medium text-slate-300">Attempt #{index + 1} on {new Date(attempt.timestamp).toLocaleDateString()}</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                          (attempt.score / attempt.total) >= 0.7 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                          Score: {attempt.score} / {attempt.total}
                      </span>
                  </li>
              ))}
            </ul>
        </div>
      )}

    </div>
  );
};

export default LessonView;
