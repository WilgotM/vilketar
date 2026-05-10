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

Var skeptisk mot tekniskt korrekta men obskyra kort. Hellre färre roliga kort
än många tråkiga.
