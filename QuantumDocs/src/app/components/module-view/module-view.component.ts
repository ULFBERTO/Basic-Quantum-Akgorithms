import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LearningPathService, UserProgress } from '../../services/learning-path.service';
import { Course, Module } from '../../models/curriculum.model';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-module-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './module-view.component.html',
    styleUrls: ['./module-view.component.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger(100, [
                        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class ModuleViewComponent implements OnInit {
    course: Course | null = null;
    progress$: Observable<UserProgress>;

    constructor(
        private learningService: LearningPathService,
        private router: Router
    ) {
        this.progress$ = this.learningService.progress$;
    }

    ngOnInit() {
        this.course = this.learningService.getCourse();
    }

    startLesson(moduleId: string, lessonId: string) {
        this.router.navigate(['/learn', moduleId, lessonId]);
    }

    isLessonCompleted(lessonId: string, completedLessons: string[]): boolean {
        return completedLessons.includes(lessonId);
    }

    isLessonLocked(lessonId: string): boolean {
        return !this.learningService.isLessonUnlocked(lessonId);
    }
}
