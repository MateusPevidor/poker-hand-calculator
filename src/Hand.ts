import { Evaluator } from './Evaluator.js';
import { encodeBits } from './utils.js';

interface Card {
  value: number // 0-12 = 2-A
  suit: number // 0-3  = A-Z
}

export class Hand {
  private readonly _cards: Card[];

  constructor() {
    this._cards = [];
  }

  get cards(): Card[] {
    return this._cards;
  }

  deal(card: Card): void {
    this._cards.push(card);
  }

  evaluate(tableCards: Card[]): number {
    const cards = [...this._cards, ...tableCards];

    const evaluator = new Evaluator();

    const evaluation = evaluator.evaluate(cards);

    const values = [
      evaluation.rank,
      evaluation.primaryScore,
      evaluation.secondaryScore,
      ...evaluation.kickers.map(card => card.value)
    ];

    const score = encodeBits(0, values, 4, 28);

    return score;
  }

  log(): void {
    console.log(this.cards);
  }
}
