# VilketÅr

Svenskt tidslinjespel byggt med Next.js, Bun och Wikimedia-data.

- Använd Bun. Kör inte npm eller yarn.
- Viktiga kontroller: `bun test`, `bun run lint`, `bun run format:check`.
- Bygg/deploy: `bun run build`, `bun run deploy`.
- Kort och kategorier ska kännas svenska, igenkännbara och spelbara.
- Korten ska länka till svenska Wikipedia när Wikipedia används.
- Framsidan på kort får inte avslöja årtal.
- Publicerade deck ligger i `public/decks/`.
- Källqueries ligger i `content/queries/<query-id>/`.
- Deck-struktur och kategoriidéer finns i `content/deck-tree.ts`.
- Innehållsscript finns i `content/scripts/`.

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
