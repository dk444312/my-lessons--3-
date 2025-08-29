import React, { useState } from 'react';
import { type Lesson } from '../types';
import { generateLessonNotes } from '../services/geminiService';
import { SparklesIcon, UploadIcon } from './IconComponents';

interface AddLessonModalProps {
  onClose: () => void;
  onAddLesson: (lesson: Omit<Lesson, 'id' | 'createdAt' | 'mcqs' | 'feedback' | 'quizAttempts'>) => void;
}

type Mode = 'manual' | 'ai';

const AddLessonModal: React.FC<AddLessonModalProps> = ({ onClose, onAddLesson }) => {
  const [mode, setMode] = useState<Mode>('manual');
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [notes, setNotes] = useState('');
  const [week, setWeek] = useState(1);
  const [aiTopic, setAiTopic] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateNotes = async () => {
    if (!aiTopic) {
      setError("Please enter a topic to generate notes.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedNotes = await generateLessonNotes(aiTopic);
      setNotes(generatedNotes);
      setTitle(aiTopic);
    } catch (e) {
      setError("Failed to generate notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        setError("Title is required.");
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const imageUrls = await Promise.all(imageFiles.map(fileToDataUri));

      onAddLesson({
        title,
        notes,
        imageUrls,
        course,
        week,
      });
    } catch (e) {
      setError("Failed to process images.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in-down">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create New Lesson</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex border border-slate-700 rounded-lg p-1 mb-6 bg-slate-900">
                <button onClick={() => setMode('manual')} className={`w-1/2 py-2 rounded-md transition-colors ${mode === 'manual' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Manual Input</button>
                <button onClick={() => setMode('ai')} className={`w-1/2 py-2 rounded-md transition-colors ${mode === 'ai' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Generate with AI</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'ai' && (
                    <div className="space-y-2">
                        <label htmlFor="ai-topic" className="block text-sm font-medium text-slate-300">Topic</label>
                        <div className="flex gap-2">
                            <input
                                id="ai-topic"
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="e.g., 'The Renaissance'"
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleGenerateNotes}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-slate-600"
                            >
                                <SparklesIcon className="h-5 w-5" />
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-slate-300">Title</label>
                      <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Lesson Title"
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                  </div>
                   <div className="space-y-2">
                      <label htmlFor="week" className="block text-sm font-medium text-slate-300">Week</label>
                      <input
                          id="week"
                          type="number"
                          value={week}
                          onChange={(e) => setWeek(parseInt(e.target.value, 10) || 1)}
                          min="1"
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                  </div>
                </div>

                <div className="space-y-2">
                      <label htmlFor="course" className="block text-sm font-medium text-slate-300">Course (Optional)</label>
                      <input
                          id="course"
                          type="text"
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g., History 101"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-300">Notes</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={8}
                        placeholder="Write your lesson notes here..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    ></textarea>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="images" className="block text-sm font-medium text-slate-300">Upload Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">{imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'PNG, JPG, GIF up to 10MB'}</p>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                
                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-wait">
                        {isLoading ? 'Saving...' : 'Save Lesson'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddLessonModal;