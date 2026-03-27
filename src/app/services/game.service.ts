import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../models/question.model';
import { QuestionService } from './question.service';
import { take } from 'rxjs';

export interface AnsweredQuestion {
  question: Question;
  selectedAnswerId: string;
  correct: boolean;
}

export interface AnswerEvent {
  correct: boolean;
  version: number; // increments every answer — guarantees effect() fires
}

const TOTAL_QUESTIONS = 25;

const DIFFICULTY_THRESHOLDS: Record<number, 1 | 2 | 3 | 4 | 5> = {
  0:  1,
  5:  2,
  10: 3,
  15: 4,
  20: 5,
};

function difficultyForScore(score: number): 1 | 2 | 3 | 4 | 5 {
  let level: 1 | 2 | 3 | 4 | 5 = 1;
  for (const [threshold, diff] of Object.entries(DIFFICULTY_THRESHOLDS)) {
    if (score >= Number(threshold)) level = diff;
  }
  return level;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly #router = inject(Router);
  readonly #questionService = inject(QuestionService);

  readonly playerName = signal('');
  readonly score = signal(0);
  readonly questionsAnswered = signal(0);
  readonly history = signal<AnsweredQuestion[]>([]);
  readonly currentQuestion = signal<Question | null>(null);
  /** Versioned event — always changes so effect() fires on every answer */
  readonly lastAnswerEvent = signal<AnswerEvent | null>(null);
  /** null = no level-up; number = the new level just reached */
  readonly levelUpTo = signal<number | null>(null);

  #answerVersion = 0;

  readonly currentDifficulty = computed(() =>
    difficultyForScore(this.score())
  );

  readonly progress = computed(() =>
    Math.round((this.questionsAnswered() / TOTAL_QUESTIONS) * 100)
  );

  readonly isFinished = computed(
    () => this.questionsAnswered() >= TOTAL_QUESTIONS
  );

  /** All question ids already used in this game session */
  #usedIds = new Set<number>();
  #allQuestions: Question[] = [];

  startGame(playerName: string): void {
    this.playerName.set(playerName);
    this.score.set(0);
    this.questionsAnswered.set(0);
    this.history.set([]);
    this.lastAnswerEvent.set(null);
    this.levelUpTo.set(null);
    this.#answerVersion = 0;
    this.#usedIds = new Set();

    this.#questionService.getAll().pipe(take(1)).subscribe((questions) => {
      this.#allQuestions = questions;
      this.#navigateToNext();
    });
  }

  submitAnswer(selectedAnswerId: string): void {
    const question = this.currentQuestion();
    if (!question) return;

    const prevDifficulty = this.currentDifficulty();
    const correct = selectedAnswerId === question.correctAnswerId;

    this.lastAnswerEvent.set({ correct, version: ++this.#answerVersion });
    this.score.update((s) => Math.max(0, s + (correct ? 1 : -1)));
    this.questionsAnswered.update((n) => n + 1);
    this.history.update((h) => [
      ...h,
      { question, selectedAnswerId, correct },
    ]);

    const newDifficulty = this.currentDifficulty();
    if (newDifficulty > prevDifficulty) {
      this.levelUpTo.set(newDifficulty);
    } else {
      this.levelUpTo.set(null);
    }

    if (this.isFinished()) {
      this.#router.navigate(['/results']);
    } else {
      this.#navigateToNext();
    }
  }

  #navigateToNext(): void {
    const difficulty = this.currentDifficulty();
    const pool = this.#allQuestions.filter(
      (q) => q.difficulty === difficulty && !this.#usedIds.has(q.id)
    );

    // Fallback: if all questions of current level are exhausted, use any unused
    const available = pool.length > 0
      ? pool
      : this.#allQuestions.filter((q) => !this.#usedIds.has(q.id));

    if (available.length === 0) {
      this.#router.navigate(['/results']);
      return;
    }

    const next = available[Math.floor(Math.random() * available.length)];
    this.#usedIds.add(next.id);
    this.currentQuestion.set(next);
    this.#router.navigate(['/question']);
  }
}



