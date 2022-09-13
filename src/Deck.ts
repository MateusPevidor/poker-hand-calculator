interface Card {
  value: number // 0-12 = 2-A
  suit: number // 0-3  = A-Z
}

export class Deck {
  private _cards: Card[];

  constructor() {
    this.reset();
  }

  get cards(): Card[] {
    return this._cards.slice();
  }

  reset(): void {
    this._cards = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        this._cards.push({ value: j, suit: i });
      }
    }
  }

  pop(): Card {
    return this._cards.pop();
  }

  peek(): Card {
    return Object.assign({}, this._cards[this._cards.length - 1]);
  }

  shuffle(): void {
    // Don't know is the line of code below is good enough
    // this._cards = this._cards.sort(() => Math.random() - 0.5);

    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this._cards[i];
      this._cards[i] = this._cards[j];
      this._cards[j] = temp;
    }
  }
}
