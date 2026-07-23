import musicCards from "../public/decks/all-entertainment-music.json";
import { Card } from "../types/cards";

const canonicalMusicCards = musicCards as Card[];

function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/[“”\"']/g, "")
    .replace(/[,&]/g, " ")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("sv-SE");
}

const musicCardsByQid = new Map(
  canonicalMusicCards.map((card) => [card.qid, card]),
);
const musicCardsBySpotifyTrackId = new Map(
  canonicalMusicCards
    .map((card) =>
      card.music ? ([card.music.spotifyTrackId, card] as const) : null,
    )
    .filter((entry): entry is readonly [string, Card] => entry !== null),
);
const musicCardsByTitleAndArtist = new Map(
  canonicalMusicCards.map((card) => [
    `${normalize(card.title)}\u0000${normalize(card.music?.artist ?? card.subtitle)}`,
    card,
  ]),
);

function getSpotifyTrackId(qid: string): string | null {
  return qid.startsWith("spotify:") ? qid.slice("spotify:".length) : null;
}

export function getCanonicalMusicCard(card: Card): Card | null {
  if (card.music) {
    return card;
  }

  const qidMatch = musicCardsByQid.get(card.qid);
  if (qidMatch?.music) {
    return qidMatch;
  }

  const spotifyTrackId = getSpotifyTrackId(card.qid);
  const spotifyTrackMatch = spotifyTrackId
    ? musicCardsBySpotifyTrackId.get(spotifyTrackId)
    : null;
  if (spotifyTrackMatch?.music) {
    return spotifyTrackMatch;
  }

  const titleAndArtistMatch = musicCardsByTitleAndArtist.get(
    `${normalize(card.title)}\u0000${normalize(card.subtitle)}`,
  );

  return titleAndArtistMatch?.music ? titleAndArtistMatch : null;
}

export function hydrateCanonicalMusicFields<TCard extends Card>(
  card: TCard,
): TCard {
  if (card.music) {
    return card;
  }

  const canonicalCard = getCanonicalMusicCard(card);
  if (!canonicalCard?.music) {
    return card;
  }

  return {
    ...card,
    image: card.image || canonicalCard.image,
    music: canonicalCard.music,
    wikipediaSlug: card.wikipediaSlug ?? canonicalCard.wikipediaSlug,
  };
}
