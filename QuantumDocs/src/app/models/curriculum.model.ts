export type ContentType = 'text' | 'video' | 'interactive' | 'quiz';

export interface ContentBlock {
    id: string;
    type: ContentType;
    title?: string;
    data: string; // Markdown text, Video URL, or specialized data
    meta?: any; // For interactive components configs
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    content: ContentBlock[];
    quiz?: QuizQuestion[];
    xpReward: number;
    isLocked?: boolean;
}

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    lessons: Lesson[];
    isLocked?: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    modules: Module[];
}
