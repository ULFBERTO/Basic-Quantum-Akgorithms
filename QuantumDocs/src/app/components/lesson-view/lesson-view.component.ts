import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { LearningPathService } from '../../services/learning-path.service';
import { Lesson, Module, ContentBlock, QuizQuestion } from '../../models/curriculum.model';
import { Subscription } from 'rxjs';
import { BlochSphereComponent } from '../bloch-sphere/bloch-sphere.component';
import { CircuitDesignerComponent } from '../circuit-designer/circuit-designer.component';

@Component({
    selector: 'app-lesson-view',
    standalone: true,
    imports: [CommonModule, RouterModule, BlochSphereComponent, CircuitDesignerComponent],
    templateUrl: './lesson-view.component.html',
    styleUrls: ['./lesson-view.component.scss']
})
export class LessonViewComponent implements OnInit, OnDestroy {
    currentModule: Module | undefined;
    currentLesson: Lesson | undefined;

    // For Quiz
    quizActive = false;
    currentQuizQuestionIndex = 0;
    selectedOptionIndex: number | null = null;
    quizCompleted = false;
    quizFeedback: string | null = null;

    private routeSub: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private learningService: LearningPathService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.routeSub = this.route.paramMap.subscribe(params => {
            const moduleId = params.get('moduleId');
            const lessonId = params.get('lessonId');

            if (moduleId && lessonId) {
                this.loadLesson(moduleId, lessonId);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub?.unsubscribe();
    }

    loadLesson(moduleId: string, lessonId: string) {
        this.currentModule = this.learningService.getModule(moduleId);
        this.currentLesson = this.learningService.getLesson(moduleId, lessonId);

        if (!this.currentLesson || !this.currentModule) {
            this.router.navigate(['/learn']); // Redirect if not found
            return;
        }

        // Reset state
        this.quizActive = false;
        this.currentQuizQuestionIndex = 0;
        this.selectedOptionIndex = null;
        this.quizCompleted = false;
    }

    getSafeVideoUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    completeLesson() {
        if (this.currentLesson) {
            if (this.currentLesson.quiz && !this.quizCompleted) {
                this.quizActive = true;
                return;
            }

            this.learningService.completeLesson(this.currentLesson.id, this.currentLesson.xpReward);
            // Navigate to next lesson or back to module view
            this.router.navigate(['/learn']);
        }
    }

    // Quiz Logic
    selectOption(index: number) {
        this.selectedOptionIndex = index;
    }

    submitAnswer() {
        if (this.selectedOptionIndex === null || !this.currentLesson?.quiz) return;

        const question = this.currentLesson.quiz[this.currentQuizQuestionIndex];
        if (this.selectedOptionIndex === question.correctAnswerIndex) {
            // Correct
            if (this.currentQuizQuestionIndex < this.currentLesson.quiz.length - 1) {
                this.currentQuizQuestionIndex++;
                this.selectedOptionIndex = null;
            } else {
                this.quizCompleted = true;
                this.quizActive = false;
                this.completeLesson(); // Auto complete after quiz
            }
        } else {
            // Incorrect
            this.quizFeedback = "Incorrect, try again!";
            setTimeout(() => this.quizFeedback = null, 2000);
        }
    }
}
