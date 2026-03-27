import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  readonly #http = inject(HttpClient);

  readonly #questions$: Observable<Question[]> = this.#http
    .get<Question[]>('assets/data/questions.json')
    .pipe(shareReplay(1));

  getAll(): Observable<Question[]> {
    return this.#questions$;
  }

  getById(id: number): Observable<Question | undefined> {
    return this.#questions$.pipe(
      map((questions) => questions.find((q) => q.id === id))
    );
  }
}

