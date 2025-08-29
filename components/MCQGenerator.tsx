import React, { useState, useEffect } from 'react';
import { type Lesson, type MCQ } from '../types';
import { generateMCQs } from '../services/geminiService';
import { SparklesIcon } from './IconComponents';

interface MCQGeneratorProps {
  lesson: Lesson;
  onUpdate: (lesson: Lesson) => void;
}

const MCQGenerator: React.FC<MCQGeneratorProps> = ({ lesson, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Reset quiz when lesson changes
    resetQuiz();
  }, [lesson.id, lesson.mcqs.length]);

  const resetQuiz = () => {
    setIsQuizActive(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleGenerateMCQs = async () => {
    if (!lesson.notes) {
      setError("Cannot generate questions without lesson notes.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newMcqs = await generateMCQs(lesson.notes);
      onUpdate({ ...lesson, mcqs: newMcqs });
      resetQuiz();
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionIndex: number, option: string) => {
    if (!isSubmitted) {
      setUserAnswers(prev => ({ ...prev, [questionIndex]: option }));
    }
  };

  const handleSubmitQuiz = () => {
    let currentScore = 0;
    lesson.mcqs.forEach((mcq, index) => {
      if (userAnswers[index] === mcq.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    
    const newAttempt = {
      score: currentScore,
      total: lesson.mcqs.length,
      timestamp: new Date().toISOString()
    };
    
    onUpdate({
      ...lesson,
      quizAttempts: [...(lesson.quizAttempts || []), newAttempt]
    });
  };

  const getOptionClassName = (mcq: MCQ, option: string, index: number) => {
    if (!isSubmitted) {
      return userAnswers[index] === option ? 'bg-sky-500/80' : 'bg-slate-600 hover:bg-slate-500';
    }
    if (option === mcq.correctAnswer) {
      return 'bg-green-500/80 text-white font-bold';
    }
    if (userAnswers[index] === option && option !== mcq.correctAnswer) {
      return 'bg-red-500/80 text-white';
    }
    return 'bg-slate-600';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Test Your Knowledge</h2>
        <button
          onClick={handleGenerateMCQs}
          disabled={isLoading || !lesson.notes}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              {lesson.mcqs.length > 0 ? 'Regenerate Questions' : 'Generate Questions'}
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      {!lesson.notes && <p className="text-slate-400 text-center">Add some notes to your lesson to generate questions.</p>}

      {lesson.mcqs.length > 0 && (
        <>
        <div className="space-y-6">
          {lesson.mcqs.map((mcq, index) => (
            <div key={index} className="bg-slate-700 p-4 rounded-lg">
              <p className="font-semibold text-lg">{index + 1}. {mcq.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
                {mcq.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    disabled={isSubmitted}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`p-3 rounded-md text-left text-sm w-full transition-colors disabled:cursor-not-allowed ${getOptionClassName(mcq, option, index)}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
            {isSubmitted ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-2xl font-bold">Your score: <span className="text-green-400">{score} / {lesson.mcqs.length}</span></p>
                <button onClick={resetQuiz} className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600">
                    Take Again
                </button>
              </div>
            ) : isQuizActive ? (
                 <button onClick={handleSubmitQuiz} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                    Submit Quiz
                </button>
            ) : (
                <button onClick={() => setIsQuizActive(true)} className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600">
                    Start Quiz
                </button>
            )}
        </div>
        </>
      )}
    </div>
  );
};

export default MCQGenerator;
