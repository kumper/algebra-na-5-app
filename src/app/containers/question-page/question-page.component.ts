import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CardComponent } from '../../components/card/card.component';
import { QuestionDisplayComponent } from '../../components/question-display/question-display.component';

const LEVEL_CLASSES: Record<number, string> = {
  1: 'level-1', 2: 'level-2', 3: 'level-3', 4: 'level-4', 5: 'level-5',
};

const CORRECT_TOASTS = [
  'Super! 🎉', 'Świetnie! ⭐', 'Brawo! 👏', 'Doskonale! 🔥', 'Tak trzymaj! 💪',
  'Amerykańsko! 🇺🇸', 'Gites! 😎', 'Tak jest! 🫡', 'Dokładnie! 🎯',
  'Mistrzostwo! 🏅', 'No to HIT! 🚀', 'Luz blues! 😄', 'Petarda! 🧨',
];
const WRONG_TOASTS = [
  'Nieee... 😬', 'To nie to 🙅', 'Niestety... 😕',
  'Prawie! 🙈', 'Spróbuj dalej! 💡', 'Nie tym razem 😅', 'Oj, oj... 🤔',
];

@Component({
  selector: 'app-question-page',
  imports: [CardComponent, QuestionDisplayComponent],
  templateUrl: './question-page.component.html',
  styleUrl: './question-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionPageComponent {
  protected readonly game = inject(GameService);

  readonly selectedAnswerId = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly levelUpMessage = signal<string | null>(null);

  readonly levelClass = computed(
    () => LEVEL_CLASSES[this.game.currentDifficulty()] ?? 'level-1'
  );

  readonly #toastEffect = effect(() => {
    const event = this.game.lastAnswerEvent();
    if (event === null) return;

    // version is always unique — effect fires on every answer guaranteed
    const pool = event.correct ? CORRECT_TOASTS : WRONG_TOASTS;
    this.toastMessage.set(pool[Math.floor(Math.random() * pool.length)]);
    setTimeout(() => this.toastMessage.set(null), 900);
  });

  readonly #levelUpEffect = effect(() => {
    const level = this.game.levelUpTo();
    if (level === null) return;

    this.levelUpMessage.set(`Poziom ${level}! 🚀`);
    setTimeout(() => this.levelUpMessage.set(null), 1000);
  });

  select(answerId: string): void {
    this.selectedAnswerId.set(answerId);
  }

  confirm(): void {
    const selected = this.selectedAnswerId();
    if (!selected) return;
    this.game.submitAnswer(selected);
    this.selectedAnswerId.set(null);
  }
}


