# VilketÅr

VilketÅr är ett svenskt tidslinjespel byggt som en egen version av
Wikitrivia. Spelaren placerar kort i kronologisk ordning, med fakta, bilder och
länkar från Wikidata och svenska Wikipedia.

Biblioteket är ersatt med en svensk katalog: korten kräver svensk
Wikipedia-artikel, använder svenska Wikidata-etiketter och visas i svenska
kategorier. Det behåller bredden från originalets spelkänsla med både svenska
och internationellt välkända händelser, personer, verk, platser, teknik, sport
och företag. Appen är statiskt exporterad med Next.js och redo för Cloudflare
Pages.

## Setup

Installera beroenden:

```bash
bun install
```

Skapa en lokal `.env` innan scripts som kontaktar Wikimedia körs:

```bash
cp .env.example .env
```

Fyll i `WIKITRIVIA_CONTACT_EMAIL` och `WIKITRIVIA_REPO_SLUG`. Kontaktadressen
används i Wikimedia User-Agent.

## Utveckling

Kör lokalt:

```bash
bun run dev
```

Bygg statiskt:

```bash
bun run build
```

Servera den byggda sidan:

```bash
bun run start
```

Kör kontroller:

```bash
bun run typecheck
bun run lint
bun run test
```

## Innehåll

Källrader ligger i `content/queries/`. Deck-filer byggs till `public/decks/`:

```bash
bun run decks:build
```

Den publicerade spelkatalogen ligger i `public/decks/` och är filtrerad mot
svenska Wikipedia. Metadata hämtas från Wikidata och svenska Wikipedia. Cacher
ligger i `content/cache/`.

## Supabase

Projektet är länkat mot Supabase-projektet `VilketÅr`.

Migrationer:

```bash
supabase db push
```

Appen använder publika env-vars vid deploy:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Om de saknas fungerar spelet ändå, men remote highscores sparas inte.

Vänligor använder Supabase Auth utan synlig inloggning. Slå på anonymous
sign-ins i Supabase Dashboard under Auth innan ligorna används:

```text
Authentication -> Sign In / Providers -> Anonymous sign-ins
```

Spelaren får bara välja ett namn i appen. Bakom kulisserna skapas en anonym
Supabase-användare så ligor, veckopoäng och dagens resultat kan kopplas till
samma webbläsare.

Auth-mejlmallar ligger i `supabase/templates/` och kopplas i
`supabase/config.toml`. När en anonym användare sparar sitt första konto med
e-post använder Supabase internt mallen `email_change`, så den mallen är skriven
för både första kontobekräftelse och riktiga e-postbyten.

För publik drift ska Supabase Auth använda egen SMTP med en avsändare som
`VilketÅr <no-reply@...>`. Supabases inbyggda SMTP är bara för test och kan visa
`Supabase Auth` som avsändare.

## Cloudflare Pages

Cloudflare Pages-projektet heter `vilketar`.

Deploy:

```bash
bun run deploy
```

## Licenser

Koden bygger på Wikitrivia och originalets MIT-licens finns kvar i
`LICENSE.md`. Wikidata-data är CC0. Innehåll från svenska Wikipedia är normalt
CC BY-SA och appen länkar tillbaka till artiklarna.
