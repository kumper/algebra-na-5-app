import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, shareReplay, map } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  readonly #http = inject(HttpClient);

  readonly #questions$: Observable<Question[]> = forkJoin(
    [1, 2, 3, 4, 5].map((level) =>
      this.#http.get<Question[]>(`assets/data/questions-${level}.json`)
    )
  ).pipe(
    map((arrays) => arrays.flat()),
    shareReplay(1)
  );

  getAll(): Observable<Question[]> {
    return this.#questions$;
  }

  getById(id: number): Observable<Question | undefined> {
    return this.#questions$.pipe(
      map((questions) => questions.find((q) => q.id === id))
    );
  }

  getByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): Observable<Question[]> {
    return this.#questions$.pipe(
      map((questions) => questions.filter((q) => q.difficulty === difficulty))
    );
  }
}


