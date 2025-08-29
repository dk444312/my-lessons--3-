import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Lesson } from './types';
import Loader from './components/Loader';
import Header from './components/Header';
import LessonList from './components/LessonList';
import LessonView from './components/LessonView';
import AddLessonModal from './components/AddLessonModal';
import Sidebar from './components/Sidebar';
import StudyBuddy from './components/StudyBuddy';
import AITools from './components/AITools';

export type View = 'dashboard' | 'ai-tools' | 'study-buddy';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useLocalStorage<Lesson[]>('lessons', []);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddLesson = (newLesson: Omit<Lesson, 'id' | 'createdAt' | 'mcqs' | 'feedback' | 'quizAttempts'>) => {
    const lessonWithId: Lesson = {
      ...newLesson,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      mcqs: [],
      feedback: undefined,
      quizAttempts: [],
    };
    setLessons(prev => [...prev, lessonWithId]);
    setIsModalOpen(false);
  };
  
  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
    if (selectedLesson && selectedLesson.id === updatedLesson.id) {
        setSelectedLesson(updatedLesson);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lessonId));
    setSelectedLesson(null);
  };
  
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveView('dashboard');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onAddLesson={() => setIsModalOpen(true)} />
        <main className="flex-1 container mx-auto p-4 md:p-8 overflow-y-auto">
          {activeView === 'dashboard' && (
            selectedLesson ? (
              <LessonView 
                lesson={selectedLesson} 
                onBack={() => setSelectedLesson(null)} 
                onDelete={handleDeleteLesson}
              />
            ) : (
              <LessonList lessons={lessons} onSelectLesson={handleSelectLesson} />
            )
          )}
          {activeView === 'ai-tools' && <AITools lessons={lessons} onUpdate={handleUpdateLesson} />}
          {activeView === 'study-buddy' && <StudyBuddy lessons={lessons} />}
        </main>
      </div>
      {isModalOpen && (
        <AddLessonModal 
          onClose={() => setIsModalOpen(false)} 
          onAddLesson={handleAddLesson} 
        />
      )}
    </div>
  );
};

export default App;
