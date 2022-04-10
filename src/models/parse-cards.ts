class InvalidCardsStringError extends Error {
  constructor() {
    super("invalid cards string");
  }
}

export function parseCards(str: string): number[] {
  const separator = /,| /g;
  const cardRatioStrings = str.split(separator).filter((s) => !!s);
  if (cardRatioStrings.length !== 5) {
    throw new InvalidCardsStringError();
  }

  const cards = cardRatioStrings.map((s) => parseInt(s, 10));
  if (cards.some((n) => typeof n !== "number" || isNaN(n))) {
    throw new InvalidCardsStringError();
  }

  return cards;
}
