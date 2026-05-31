# VilketÅr

Svenskt tidslinjespel byggt med Next.js, Bun och Wikimedia-data.

- Använd Bun. Kör inte npm eller yarn.
- Viktiga kontroller: `bun test`, `bun run lint`, `bun run format:check`.
- Bygg/deploy: `bun run build`, `bun run deploy`.
- Supabase CLI finns lokalt på `/opt/homebrew/bin/supabase` och kan användas
  direkt för t.ex. `supabase link` och `supabase db push`.
- Codex får själv köra `/opt/homebrew/bin/supabase db push` när en migration
  behöver appliceras. Fråga inte om extra tillstånd för detta i den här
  arbetsytan.
- Kort och kategorier ska kännas svenska, igenkännbara och spelbara.
- Korten ska länka till svenska Wikipedia när Wikipedia används.
- Framsidan på kort får inte avslöja årtal.
- Publicerade deck ligger i `public/decks/`.
- Källqueries ligger i `content/queries/<query-id>/`.
- Deck-struktur och kategoriidéer finns i `content/deck-tree.ts`.
- Innehållsscript finns i `content/scripts/`.
- Appen har en universell tillbaka-knapp längst upp till vänster. Lägg inte
  till egna tillbaka-knappar i vyer, paneler eller formulär.

## Kort, deck och innehåll

Kort kommer i praktiken från två håll:

- Wikimedia/Wikidata-källor körs via query-mappar i
  `content/queries/<query-id>/`. Queryn beskriver hur data hämtas och byggs om
  till kort.
- Handplockade svenska kort ligger i
  `content/scripts/add-handpicked-swedish-cards.ts`. De används för att göra
  spelet mer svenskt, igenkännbart och roligt än rena automatiska queries.

De publicerade JSON-decken i `public/decks/` är byggda artefakter som appen
läser. Ändra helst källan/scriptet och kör rätt script i stället för att
handredigera publicerade deck direkt, om det inte uttryckligen är en snabb
inspektion eller liten akut korrigering.

Vanligt arbetsflöde för innehåll:

- Uppdatera källquery, deck-träd eller handplockade kort.
- Kör relevant script, oftast `bun run decks:build`,
  `bun run decks:add-swedish-cards` och/eller `bun run decks:curate`.
- Kontrollera berörda filer i `public/decks/`, särskilt titel, undertitel,
  fakta, `year`, `wikipediaSlug`, `pageViews` och att framsidan inte avslöjar
  årtal.

`pageViews` används som en igenkänningssignal och påverkar svårighetsurval.
För handplockade kort får värdet vara ungefärligt, men ska spegla hur välkänt
kortet känns för svenska spelare.

## Dagens spel

Dagens spel ska vara tydligt och återkommande, särskilt eftersom spelet också
ska fungera bra för pensionärer.

- Svårighetsgraden för dagens spel är `hard` och ska normalt behållas. Den
  nuvarande svårighetsnivån upplevs som bra.
- Veckoschemat ligger i `lib/daily-schedule.ts`.
- Startsidan visar veckorytmen som en enkel kalender, inte en rörig
  månadskalender.
- Adminsidan för dagens spel ligger i `pages/daily-admin.tsx` och ska
  uppdateras samtidigt när schema, urval eller dagliga deck-regler ändras.
- Tisdag är sport: `all-sport-sportogonblick`.
- Fredag är musik: `all-entertainment-music`.
- Lördag är Svenska klassiker: `all-swedish-classics-all`.
- Övriga dagar är vanligt dagens spel från hela roten.
- Dagens kortkö kan låsas i Supabase-tabellen `daily_games` som `card_qids`.
  Appen använder den raden om den finns och fyller annars från aktuella
  deckfiler.
- När kort/deck ändras och deployas under samma UTC-dag kan nya deck annars
  påverka spelare som startar efter deployen. För att kortändringar bara ska
  påverka imorgon och framåt: lås dagens spel innan kort/deck ändras eller
  deployas, t.ex. med `bun run daily:lock`. Scriptet kräver
  `SUPABASE_SERVICE_ROLE_KEY` och skriver inte över en befintlig låsning utan
  `--force`.

När dagens spel behöver fler frågor, lös det helst genom fler igenkännbara,
spelbara kort i relevanta deck, inte genom att göra urvalet svårare eller mer
obskyrt.

## Sport

Sport ska kännas mer som Svenska klassiker än som nischad sportstatistik.

- Prioritera svenska eller mycket välkända sportögonblick som många i Sverige
  känner igen.
- Bra sportkort är till exempel stora OS-/VM-ögonblick, folkkära idrottare,
  ikoniska matcher, svenska medaljer och breda minnen.
- Undvik tekniskt korrekta men tråkiga/obskyra kort: administrativa
  klubbhändelser, små säsongsdetaljer, okända ligor och kort som kräver
  specialintresse.
- Hellre färre roliga sportkort än många konstiga.

## Svenska klassiker

Nya handplockade kort till **Svenska klassiker** ska läggas i
`content/scripts/add-handpicked-swedish-cards.ts`.

- Lägg dem som `ClassicTuple` i `EXTRA_CLASSIC_CARDS`.
- Använd svensk Wikipedia-titel i `pageTitle`.
- Skriv kort titel utan årtal, t.ex. `ABBA bildas`.
- Skriv kort, svensk undertitel, t.ex. `Svensk popgrupp`.
- Skriv enkel fakta utan att göra kortet obskyrt.
- Sätt ett ungefärligt `pageViews`-värde som speglar igenkänning.
- Kortet ska vara något många i Sverige känner igen och blir glada av.
- Kör sedan `bun run decks:add-swedish-cards` och `bun run decks:curate`.
- Kontrollera att `public/decks/all-swedish-classics-all.json` ser bra ut.

Var skeptisk mot tekniskt korrekta men obskyra kort. Hellre färre roliga kort
än många tråkiga.
