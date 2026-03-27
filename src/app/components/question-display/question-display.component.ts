import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-question-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './question-display.component.html',
  styleUrl: './question-display.component.scss',
})
export class QuestionDisplayComponent {
  /** The raw question string, e.g. "2 * _ = 6" */
  readonly question = input.required<string>();

  /** Optional: value to show inside the blank after the answer is revealed */
  readonly revealedAnswer = input<string | null>(null);

  /** Split the question string into parts around the _ token */
  readonly parts = computed(() => this.question().split('_'));

  readonly hasBlank = computed(() => this.parts().length > 1);
}

