import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { CardComponent } from '../../components/card/card.component';
import { QuestionDisplayComponent } from '../../components/question-display/question-display.component';

@Component({
  selector: 'app-question-page',
  imports: [CardComponent, QuestionDisplayComponent, UpperCasePipe],
  templateUrl: './question-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionPageComponent implements OnInit {
  readonly #route = inject(ActivatedRoute);
  readonly #questionService = inject(QuestionService);

  readonly question = signal<Question | null>(null);
  readonly notFound = signal(false);

  ngOnInit(): void {
    const id = Number(this.#route.snapshot.paramMap.get('id'));
    this.#questionService.getById(id).subscribe((q) => {
      if (q) {
        this.question.set(q);
      } else {
        this.notFound.set(true);
      }
    });
  }
}


