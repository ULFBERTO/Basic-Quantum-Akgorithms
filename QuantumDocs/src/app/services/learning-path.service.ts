import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Module, Lesson } from '../models/curriculum.model';
import { QUANTUM_ZERO_TO_HERO } from '../data/curriculum.data';

export interface UserProgress {
    completedLessons: string[]; // IDs of completed lessons
    completedModules: string[];
    currentLessonId: string;
    totalXP: number;
}

@Injectable({
    providedIn: 'root'
})
export class LearningPathService {
    private courseData: Course = QUANTUM_ZERO_TO_HERO;

    private progressSource = new BehaviorSubject<UserProgress>(this.loadProgress());
    public progress$ = this.progressSource.asObservable();

    constructor() { }

    getCourse(): Course {
        return this.courseData;
    }

    getModule(moduleId: string): Module | undefined {
        return this.courseData.modules.find(m => m.id === moduleId);
    }

    getLesson(moduleId: string, lessonId: string): Lesson | undefined {
        return this.getModule(moduleId)?.lessons.find(l => l.id === lessonId);
    }

    completeLesson(lessonId: string, xpEarned: number) {
        const current = this.progressSource.value;
        if (!current.completedLessons.includes(lessonId)) {
            const newProgress: UserProgress = {
                ...current,
                completedLessons: [...current.completedLessons, lessonId],
                totalXP: current.totalXP + xpEarned
            };

            // Unlock next lesson logic could go here
            this.saveProgress(newProgress);
            this.progressSource.next(newProgress);
            this.checkModuleCompletion();
        }
    }

    isLessonUnlocked(lessonId: string): boolean {
        // Simple logic: if previous lesson is completed, or it's the first one
        // For now, relies on static 'isLocked' or checking completion of previous
        // This is a simplified implementation
        const allLessons = this.getAllLessonsLinear();
        const index = allLessons.findIndex(l => l.id === lessonId);
        if (index === 0) return true;

        const prevLesson = allLessons[index - 1];
        return this.progressSource.value.completedLessons.includes(prevLesson.id);
    }

    private getAllLessonsLinear(): Lesson[] {
        return this.courseData.modules.flatMap(m => m.lessons);
    }

    private checkModuleCompletion() {
        // Logic to unlock modules
    }

    private loadProgress(): UserProgress {
        const stored = localStorage.getItem('quantum_user_progress');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            completedLessons: [],
            completedModules: [],
            currentLessonId: 'l1-particles',
            totalXP: 0
        };
    }

    private saveProgress(progress: UserProgress) {
        localStorage.setItem('quantum_user_progress', JSON.stringify(progress));
    }
}
