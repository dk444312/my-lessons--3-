import React, { useState } from 'react';
import { type Lesson } from '../types';
import MCQGenerator from './MCQGenerator';
import FeedbackGenerator from './FeedbackGenerator';
import { BookOpenIcon } from './IconComponents';

interface AIToolsProps {
  lessons: Lesson[];
  onUpdate: (lesson: Lesson) => void;
}

const AITools: React.FC<AIToolsProps> = ({ lessons, onUpdate }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (lessons.length === 0) {
    return (
       <div className="text-center py-20 animate-fade-in-down">
        <BookOpenIcon className="h-16 w-16 mx-auto text-slate-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-300">No lessons to work with!</h2>
        <p className="text-slate-400 mt-2">Create a lesson first to use the AI Tools.</p>
      </div>
    )
  }

  if (!selectedLesson) {
    return (
      <div className="animate-fade-in-down">
        <h2 className="text-3xl font-bold text-sky-400 mb-6">Select a Lesson</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="bg-slate-800 rounded-xl p-6 cursor-pointer border border-transparent hover:border-sky-500 transition-all duration-300 group"
            >
              <h3 className="text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors">{lesson.title}</h3>
              <p className="text-sm text-slate-400 mt-2">Week {lesson.week}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-down">
       <div>
        <button onClick={() => setSelectedLesson(null)} className="text-sm font-semibold text-sky-400 hover:text-sky-300 mb-4">
          &larr; Back to lesson selection
        </button>
        <h1 className="text-3xl font-bold">AI Tools for: <span className="text-sky-400">{selectedLesson.title}</span></h1>
      </div>
      <FeedbackGenerator lesson={selectedLesson} onUpdate={onUpdate} />
      <MCQGenerator lesson={selectedLesson} onUpdate={onUpdate} />
    </div>
  );
};

export default AITools;
