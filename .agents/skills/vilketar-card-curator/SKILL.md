---
name: vilketar-card-curator
description: Create and validate high-quality VilketÅr timeline cards. Use when adding, reviewing, or expanding non-music cards in content/scripts/add-handpicked-swedish-cards.ts or public/decks, especially when cards must be clear in Swedish, unique, dated correctly, linked to real Swedish Wikipedia pages, and backed by a relevant Wikimedia image.
---

# VilketÅr-kortkurator

Use this skill for every new VilketÅr card batch. Treat quality as a hard gate: a smaller batch of memorable, unambiguous cards is better than padding the requested count with obscure or weak cards.

## Workflow

1. Inspect the current published deck and the relevant source arrays before proposing cards. Compare against the baseline so every requested card is genuinely new.
2. Draft substantially more candidates than requested. Prefer broadly recognisable events, people, inventions, places, products, books, games, science milestones, Swedish memories, and famous sports moments.
3. Reject candidates that are niche, administrative, repetitive, dependent on specialist knowledge, hard to date to one year, or likely to be confused with another event.
4. Write every accepted card as a `ClassicTuple` in `content/scripts/add-handpicked-swedish-cards.ts` (or as an explicit `HandpickedCard` when a fixed deck assignment or image override is necessary).
5. Use the exact Swedish Wikipedia page title in `pageTitle`. Keep `title` short and natural without a year. Keep `subtitle` as a quick Swedish clue. Keep `fact` to one concrete sentence that helps recognition without revealing the year.
6. Build with `bun run decks:add-swedish-cards`.
7. Run `bun run cards:validate -- --expected <new-count>` before considering the batch finished. The validator checks the generated deck, real Wikipedia pages, Commons files, duplicates, front text, and music isolation.
8. Run `bun run format:check`, `bun run lint`, and `bun test`.

## Quality gate

Score each candidate mentally from 0–2 on each dimension before adding it:

- Recognition: many Swedish players can place it or understand why it matters.
- Clarity: the event is immediately understandable from title, subtitle, and fact.
- Chronology: one defensible year is available and the event is meaningful in that year.
- Distinctiveness: it is not a renamed or near-duplicate version of an existing card.
- Swedish wording: idiomatic, short, concrete, and free of unnecessary English.
- Image fit: a real, relevant Wikimedia image exists and does not mislead.

Prefer cards scoring at least 10/12. Reject any card that fails image, Wikipedia, or distinctiveness checks even if its score is otherwise high.

## Card-writing rules

- Never put the answer year in `title` or `subtitle`; the front of the card must not reveal it.
- Avoid vague verbs such as “slår igenom” unless the moment is exceptionally famous and the fact names the concrete achievement.
- Avoid generic tournament, company-administration, small-league, or obscure succession events.
- Use Swedish Wikipedia whenever Wikipedia is used. A `manual-*` QID is a warning that the page title or API lookup needs correction; fix it rather than accepting it silently.
- Do not use a generic flag, logo, or unrelated portrait when a named person/event/place needs a more specific image.
- Do not add music cards when the request excludes music. Avoid music-related wording in facts that can accidentally route a technology card into music.
- Preserve existing cards. A new batch must not remove old cards or alter the music deck.

## Validation commands

From the repository root:

```bash
bun run decks:add-swedish-cards
bun run cards:validate -- --expected 100
bun run format:check
bun run lint
bun test
```

If several uncommitted batches are being validated together, set `--expected` to their combined count or commit the earlier batch first. Use `--since <git-ref>` to compare against another baseline. Add `--offline` only for a local structural check; the full check should contact Swedish Wikipedia and Wikimedia Commons.

## Where to edit

- Source of handpicked content: `content/scripts/add-handpicked-swedish-cards.ts`
- Generated public cards: `public/decks/all-swedish-classics-all.json` and `public/decks/all-sport-sportogonblick.json`
- Metadata cache: `content/cache/swedish-card-metadata.json`
- Deterministic validator: `content/scripts/validate-handpicked-cards.ts`

Do not hand-edit generated deck JSON for normal work. Edit the source, rebuild, validate, and inspect the resulting diff.
