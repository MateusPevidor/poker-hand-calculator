import { compareCardsDesc } from './utils.js';

interface Card {
  value: number // 0-12 = 2-A
  suit: number // 0-3  = A-Z
}

interface EvaluatorData {
  rank: number
  primaryScore: number
  secondaryScore: number
  kickers: Card[]
}

export class Evaluator {
  _cards: Card[];
  _values: number[];
  _suits: number[];

  _rank: number;
  _primaryScore: number;
  _secondaryScore: number;
  _kickers: Card[];

  _checks = [
    () => this.royalFlush(),
    () => this.straightFlush(),
    () => this.fourOfAKind(),
    () => this.fullHouse(),
    () => this.flush(),
    () => this.straight(),
    () => this.threeOfAKind(),
    () => this.twoPair(),
    () => this.pair(),
    () => this.highCard()
  ];

  evaluate(cards: Card[]): EvaluatorData {
    this._cards = cards.slice();
    this._rank = 10;

    this._values = cards.reduce((acc, card) => {
      acc[card.value]++;
      return acc;
    }, new Array<number>(13).fill(0));

    this._suits = cards.reduce((acc, curr) => {
      acc[curr.suit]++;
      return acc;
    }, new Array<number>(4).fill(0));

    for (const check of this._checks) {
      if (check()) break;
    }

    return {
      rank: this._rank,
      primaryScore: this._primaryScore,
      secondaryScore: this._secondaryScore || 0,
      kickers: this._kickers
    };
  }

  private highCard(): boolean {
    const hand = this._cards.slice();

    const sortedHand = hand.sort(compareCardsDesc);

    const { value, suit } = sortedHand[0];

    this._rank = 0;
    this._primaryScore = value;
    this._kickers = hand
      .filter(card => card.value !== value || card.suit !== suit)
      .splice(0, 4);

    return true;
  }

  private pair(): boolean {
    const hand = this._cards.slice();

    const pairValue = this._values.indexOf(2);
    if (pairValue === -1) return false;

    this._rank = 1;
    this._primaryScore = pairValue;
    this._kickers = hand
      .filter(card => card.value !== pairValue)
      .sort(compareCardsDesc)
      .splice(0, 3);

    return true;
  }

  private twoPair(): boolean {
    const hand = this._cards.slice();

    const pairValues: number[] = [];
    for (let i = 0; i < 13; i++) {
      if (this._values[i] === 2) {
        pairValues.push(i);
      }
    }
    if (pairValues.length < 2) return false;

    if (pairValues.length === 3) pairValues.splice(0, 1);

    this._rank = 2;
    [this._secondaryScore, this._primaryScore] = pairValues;
    this._kickers = hand
      .filter(card => pairValues.indexOf(card.value) === -1)
      .sort(compareCardsDesc)
      .splice(0, 1);

    return true;
  }

  private threeOfAKind(): boolean {
    const hand = this._cards.slice();

    const value = this._values.indexOf(3);
    if (value === -1) return false;

    this._rank = 3;
    this._primaryScore = value;
    this._kickers = hand
      .filter(card => card.value !== value)
      .sort(compareCardsDesc)
      .splice(0, 2);

    return true;
  }

  private straight(): boolean {
    const wrappedValues = [this._values[12], ...this._values];

    const straightValues = wrappedValues.map(n => !!n);
    const { max, index } = straightValues.reduce(
      (acc, curr, i) => {
        acc.prev = curr;
        if (curr) {
          const newCount = acc.count + 1;
          if (newCount > acc.max) {
            acc.max = newCount;
            acc.index = i - 1;
          }
          acc.count = newCount;
          return acc;
        }
        acc.count = 0;
        return acc;
      },
      { count: 0, max: 0, index: 0, prev: false }
    );

    if (max < 5) return false;

    this._rank = 4;
    this._primaryScore = index;
    this._kickers = [];

    return true;
  }

  private flush(): boolean {
    const hand = this._cards.slice();

    const flushSuit = this._suits.findIndex(n => n >= 5);

    if (flushSuit === -1) return false;

    const suitedCards = hand
      .filter(card => card.suit === flushSuit)
      .sort(compareCardsDesc);

    this._rank = 5;
    this._primaryScore = suitedCards[0].value;
    this._kickers = suitedCards
      .splice(1, 4);

    return true;
  }

  private fullHouse(): boolean {
    const pairValues: number[] = [];
    const threeValues: number[] = [];
    for (let i = 0; i < 13; i++) {
      if (this._values[i] === 2) {
        pairValues.push(i);
      }
      if (this._values[i] === 3) {
        threeValues.push(i);
      }
    }

    if (threeValues.length === 0) return false;
    if (threeValues.length === 1 && pairValues.length === 0) return false;

    const primary = threeValues.pop();
    const secondary = threeValues.length ? threeValues.pop() : pairValues.pop();

    this._rank = 6;
    this._primaryScore = primary;
    this._secondaryScore = secondary;
    this._kickers = [];

    return true;
  }

  private fourOfAKind(): boolean {
    const hand = this._cards.slice();

    const value = this._values.indexOf(4);
    if (value === -1) return false;

    this._rank = 7;
    this._primaryScore = value;
    this._kickers = hand
      .filter(card => card.value !== value)
      .sort(compareCardsDesc)
      .splice(0, 1);

    return true;
  }

  private straightFlush(): boolean {
    const hand = this._cards.slice();

    const flushSuit = this._suits.findIndex(n => n >= 5);

    if (flushSuit === -1) return false;

    const values = hand.reduce((acc, card) => {
      if (card.suit === flushSuit) acc[card.value]++;
      return acc;
    }, new Array<number>(13).fill(0));

    const wrappedValues = [values[12], values];

    const straightValues = wrappedValues.map(n => !!n);
    const { max, index } = straightValues.reduce(
      (acc, curr, i) => {
        acc.prev = curr;
        if (curr) {
          const newCount = acc.count + 1;
          if (newCount > acc.max) {
            acc.max = newCount;
            acc.index = i;
          }
          acc.count = newCount;
          return acc;
        }
        acc.count = 0;
        return acc;
      },
      { count: 0, max: 0, index: 0, prev: false }
    );

    if (max < 5) return false;

    this._rank = 8;
    this._primaryScore = index;
    this._kickers = [];

    return true;
  }

  private royalFlush(): boolean {
    const hand = this._cards.slice();

    const flushSuit = this._suits.findIndex(n => n >= 5);

    if (flushSuit === -1) return false;

    const values = hand.reduce((acc, card) => {
      if (card.suit === flushSuit) acc[card.value]++;
      return acc;
    }, new Array<number>(13).fill(0));

    const wrappedValues = [values[12], values];

    const straightValues = wrappedValues.map(n => !!n);
    const { max, index } = straightValues.reduce(
      (acc, curr, i) => {
        acc.prev = curr;
        if (curr) {
          const newCount = acc.count + 1;
          if (newCount > acc.max) {
            acc.max = newCount;
            acc.index = i;
          }
          acc.count = newCount;
          return acc;
        }
        acc.count = 0;
        return acc;
      },
      { count: 0, max: 0, index: 0, prev: false }
    );

    if (max < 5 || index !== 12) return false;

    this._rank = 9;
    this._primaryScore = 0;
    this._kickers = [];

    return true;
  }
}
