import { GoogleGenAI, Type } from "@google/genai";
import { type MCQ, type Lesson } from '../types';

const apiKey = "AIzaSyDrJD9PRQVxh4iPU8ZsGyhQuuEoNggecmY";

if (!apiKey) {
  throw new Error(
    "Gemini API key not configured. An API key is required to use the AI features."
  );
}

const ai = new GoogleGenAI({ apiKey });

export const generateLessonNotes = async (topic: string): Promise<string> => {
    console.log(`Generating lesson notes for topic: ${topic}`);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create study notes on the topic: "${topic}". The notes should be well-organized, engaging, and easy for a student to read.

Formatting Instructions:
- Do NOT use any Markdown formatting (like # for headers, * or - for bullet points, or underscores for italics).
- Structure the notes with clear, descriptive headings for each section. Use uppercase for main headings.
- Use double line breaks to separate paragraphs and sections.
- The final output must be clean, plain text suitable for direct display.`
        });
        return response.text;
    } catch (error) {
        console.error("Error generating lesson notes:", error);
        throw new Error("Failed to generate lesson notes from AI.");
    }
};

export const generateMCQs = async (notes: string): Promise<MCQ[]> => {
    console.log("Generating MCQs based on notes...");
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following notes, generate 3-5 multiple-choice questions to test understanding. For each question, provide 4 options, and clearly indicate the correct answer. The notes are: "${notes}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mcqs: {
                            type: Type.ARRAY,
                            description: "A list of multiple-choice questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: {
                                        type: Type.STRING,
                                        description: "The question text."
                                    },
                                    options: {
                                        type: Type.ARRAY,
                                        description: "An array of 4 possible answers.",
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: {
                                        type: Type.STRING,
                                        description: "The correct answer, which must be one of the options."
                                    }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    },
                    required: ["mcqs"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.mcqs;
    } catch (error) {
        console.error("Error generating MCQs:", error);
        throw new Error("Failed to generate multiple-choice questions.");
    }
};

export const generateImprovementFeedback = async (notes: string): Promise<string> => {
    console.log("Generating improvement feedback based on notes...");
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Act as a helpful study coach. Analyze the following student notes and provide constructive feedback. Focus on areas for improvement such as clarity, organization, adding more detail, and potential gaps in the information. Keep the feedback encouraging, actionable, and formatted in clean, readable paragraphs. Do not use markdown. The notes are: "${notes}"`
        });
        return response.text;
    } catch (error) {
        console.error("Error generating feedback:", error);
        throw new Error("Failed to generate improvement feedback from AI.");
    }
};

export const generatePerformanceAnalysis = async (lessons: Lesson[]): Promise<string> => {
    console.log("Generating performance analysis...");

    const performanceData = lessons
        .filter(l => l.quizAttempts && l.quizAttempts.length > 0)
        .map(l => ({
            title: l.title,
            week: l.week,
            scores: l.quizAttempts.map(a => `${((a.score / a.total) * 100).toFixed(0)}%`).join(', ')
        }));

    if (performanceData.length === 0) {
        return "No quiz data is available to analyze. Please take a few quizzes to get started!";
    }

    const prompt = `
        Act as a friendly and encouraging study coach. Analyze the following student's performance data from their lessons and provide personalized feedback.
        
        Data:
        ${JSON.stringify(performanceData, null, 2)}

        Your feedback should:
        1. Start with a positive and encouraging opening.
        2. Summarize the student's overall performance.
        3. Identify strong areas (e.g., topics or weeks where scores are consistently high).
        4. Identify areas that need improvement (e.g., topics or weeks with lower scores).
        5. Provide 2-3 specific, actionable tips for improvement. For example, suggest reviewing notes for a particular lesson, or practicing more questions on a certain topic.
        6. End with a motivational closing statement.

        Keep the tone helpful and supportive. Format the output as clean paragraphs. Do not use markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating performance analysis:", error);
        throw new Error("Failed to generate performance analysis from AI.");
    }
};
