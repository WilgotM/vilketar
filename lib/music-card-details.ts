import musicCards from "../public/decks/all-entertainment-music.json";
import { Card } from "../types/cards";

const canonicalMusicCards = musicCards as Card[];

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
}

const musicCardsByQid = new Map(
  canonicalMusicCards.map((card) => [card.qid, card]),
);
const musicCardsByTitleAndArtist = new Map(
  canonicalMusicCards.map((card) => [
    `${normalize(card.title)}\u0000${normalize(card.music?.artist ?? card.subtitle)}`,
    card,
  ]),
);

export function getCanonicalMusicCard(card: Card): Card | null {
  if (card.music) {
    return card;
  }

  const qidMatch = musicCardsByQid.get(card.qid);
  if (qidMatch?.music) {
    return qidMatch;
  }

  const titleAndArtistMatch = musicCardsByTitleAndArtist.get(
    `${normalize(card.title)}\u0000${normalize(card.subtitle)}`,
  );

  return titleAndArtistMatch?.music ? titleAndArtistMatch : null;
}
