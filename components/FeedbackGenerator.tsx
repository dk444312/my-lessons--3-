import React, { useState } from 'react';
import { type Lesson } from '../types';
import { generateImprovementFeedback } from '../services/geminiService';
import { LightBulbIcon } from './IconComponents';

interface FeedbackGeneratorProps {
  lesson: Lesson;
  onUpdate: (lesson: Lesson) => void;
}

const FeedbackGenerator: React.FC<FeedbackGeneratorProps> = ({ lesson, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFeedback = async () => {
    if (!lesson.notes) {
      setError("Cannot generate feedback without lesson notes.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newFeedback = await generateImprovementFeedback(lesson.notes);
      onUpdate({ ...lesson, feedback: newFeedback });
    } catch (err) {
      setError("Failed to generate feedback. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Improve Your Notes</h2>
        <button
          onClick={handleGenerateFeedback}
          disabled={isLoading || !lesson.notes}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <LightBulbIcon className="h-5 w-5" />
              {lesson.feedback ? 'Regenerate Feedback' : 'Get Feedback'}
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      
      {lesson.feedback ? (
        <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-amber-300">Feedback from AI Coach:</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{lesson.feedback}</p>
        </div>
      ) : (
         <p className="text-slate-400 text-center">
            {lesson.notes ? 'Click "Get Feedback" to receive AI-powered suggestions.' : 'Add some notes to your lesson to get feedback.'}
         </p>
      )}
    </div>
  );
};

export default FeedbackGenerator;