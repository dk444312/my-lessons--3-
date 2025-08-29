import React, { useState, useMemo } from 'react';
import { type Lesson } from '../types';
import { generatePerformanceAnalysis } from '../services/geminiService';
import { StudyBuddyIcon } from './IconComponents';

interface StudyBuddyProps {
  lessons: Lesson[];
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ lessons }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const { totalAttempts, averageScore, hasData } = useMemo(() => {
    const allAttempts = lessons.flatMap(l => l.quizAttempts || []);
    if (allAttempts.length === 0) {
      return { totalAttempts: 0, averageScore: 0, hasData: false };
    }
    const totalScore = allAttempts.reduce((sum, a) => sum + (a.score / a.total), 0);
    return {
      totalAttempts: allAttempts.length,
      averageScore: (totalScore / allAttempts.length) * 100,
      hasData: true,
    };
  }, [lessons]);

  const handleAnalyzePerformance = async () => {
    setIsLoading(true);
    setError(null);
    setFeedback('');
    try {
      const result = await generatePerformanceAnalysis(lessons);
      setFeedback(result);
    } catch (err) {
      setError('Failed to get performance analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-down">
      <div className="text-center">
        <StudyBuddyIcon className="h-16 w-16 mx-auto text-sky-400 mb-4" />
        <h1 className="text-4xl font-bold">AI Study Buddy</h1>
        <p className="text-slate-400 mt-2">Your personal coach for tracking progress and improving your study habits.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm font-medium">TOTAL QUIZZES TAKEN</p>
          <p className="text-4xl font-bold text-sky-400 mt-2">{totalAttempts}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm font-medium">AVERAGE SCORE</p>
          <p className={`text-4xl font-bold mt-2 ${averageScore >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
            {hasData ? `${averageScore.toFixed(1)}%` : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Performance Analysis</h2>
          <button
            onClick={handleAnalyzePerformance}
            disabled={isLoading || !hasData}
            className="flex items-center gap-2 px-6 py-3 mx-auto bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Get AI Feedback'}
          </button>
        </div>

        {error && <p className="text-red-400 text-center mt-6">{error}</p>}
        
        {feedback ? (
          <div className="bg-slate-700/50 p-4 rounded-lg space-y-3 mt-6">
              <h3 className="font-semibold text-lg text-indigo-300">Feedback from your Study Buddy:</h3>
              <p className="text-slate-300 whitespace-pre-wrap">{feedback}</p>
          </div>
        ) : (
           <p className="text-slate-400 text-center mt-6">
              {hasData ? 'Click the button to get personalized feedback on your performance.' : 'Take some quizzes first to unlock performance analysis.'}
           </p>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;
