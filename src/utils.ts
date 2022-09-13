interface Card {
  value: number // 0-12 = 2-A
  suit: number // 0-3  = A-Z
}

export function compareCardsDesc(c1: Card, c2: Card): number {
  return c2.value - c1.value;
}

export function encodeBits(target: number, values: number[], shift: number, padding: number): number {
  const paddingNeeded = padding - values.length * shift;
  let newValue = target;
  for (const value of values) {
    newValue = newValue << shift;
    newValue = newValue | value;
  }
  newValue = newValue << paddingNeeded;
  return newValue;
}

export function cardsToText(cards: Card[]): string {
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['♣', '♦', '♥', '♠'];

  let str = '';
  cards.forEach(card => {
    str += `${suits[card.suit]}${values[card.value]} `;
  });
  return str;
}
