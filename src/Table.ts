import { Deck } from './Deck.js';
import { Hand } from './Hand.js';

interface Card {
  value: number // 0-12 = 2-A
  suit: number // 0-3  = A-Z
}

interface GameResult {
  hand: Card[]
  index: number
  win: boolean
}

export class Table {
  private _deck: Deck;
  private _hands: Hand[];
  private _cards: Card[];

  private _step: number; // Unset -> Hands -> Flop -> Turn -> River

  constructor() {
    this.reset();
  }

  reset(): void {
    this._deck = new Deck();
    this._deck.shuffle();

    this._hands = [];
    this._cards = [];
    this._step = 0;
  }

  addPlayers(n = 1): void {
    for (let i = 0; i < n; i++) {
      this._hands.push(new Hand());
    }
  }

  dealToHands(): void {
    this._hands.forEach(hand => {
      hand.deal(this._deck.pop());
      hand.deal(this._deck.pop());
    });
    this._step = 1;
  }

  dealToTable(count: number): void {
    for (let i = 0; i < count; i++) {
      this._cards.push(this._deck.pop());
    }
  }

  evaluate(): GameResult {
    const hands = this._hands.map((hand, i) => {
      const score = hand.evaluate(this._cards);
      return { hand, score, index: i };
    });

    const winningHand = hands.slice().sort((h1, h2) => h2.score - h1.score)[0];

    return {
      hand: hands[0].hand.cards,
      index: hands[0].index,
      win: hands[0].index === winningHand.index
    };
  }

  log(): void {
    this._hands.forEach(hand => hand.log());
    console.log(this._cards);
  }
}
