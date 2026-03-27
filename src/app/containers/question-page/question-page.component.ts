import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CardComponent } from '../../components/card/card.component';
import { QuestionDisplayComponent } from '../../components/question-display/question-display.component';

const LEVEL_CLASSES: Record<number, string> = {
  1: 'level-1',
  2: 'level-2',
  3: 'level-3',
  4: 'level-4',
  5: 'level-5',
};

@Component({
  selector: 'app-question-page',
  imports: [CardComponent, QuestionDisplayComponent],
  templateUrl: './question-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionPageComponent {
  readonly #router = inject(Router);
  protected readonly game = inject(GameService);

  readonly selectedAnswerId = signal<string | null>(null);

  readonly levelClass = computed(
    () => LEVEL_CLASSES[this.game.currentDifficulty()] ?? 'level-1'
  );

  select(answerId: string): void {
    // Allow changing answer until confirmed
    this.selectedAnswerId.set(answerId);
  }

  confirm(): void {
    const selected = this.selectedAnswerId();
    if (!selected) return;
    this.game.submitAnswer(selected);
    this.selectedAnswerId.set(null);
  }
}


