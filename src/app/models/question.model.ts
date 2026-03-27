export interface Answer {
  id: string;
  label: string;
}

export interface Question {
  id: number;
  question: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  answers: Answer[];
  correctAnswerId: string;
}

