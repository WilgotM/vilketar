# VilketÅr

Svenskt tidslinjespel byggt med Next.js, Bun och Wikimedia-data.

- Använd Bun. Kör inte npm eller yarn.
- Viktiga kontroller: `bun test`, `bun run lint`, `bun run format:check`.
- Bygg/deploy: `bun run build`, `bun run deploy`. Cloudflare Pages deployar
  automatiskt produktionsmiljön när `master` pushas; behandla inte en saknad
  lokal `CLOUDFLARE_API_TOKEN` som ett deploy-stopp utan kontrollera Pages
  Deployments.
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

## Designriktning

Tutorialen för dagens spel på `feature/daily-game-tutorial` är den främsta
visuella referensen för VilketÅrs designspråk. Efter merge, se
`components/daily-game-tutorial.tsx` och
`styles/daily-game-tutorial.css.ts` när nya vyer eller större designändringar
görs.

- Helheten ska kännas varm, lekfull, tydlig och påkostad, men fortfarande lugn
  och lätt att förstå för alla åldrar.
- Använd mörka, mjuka ytor med subtilt djup, guldgula accenter som leder blicken,
  stor självsäker typografi och få men starka grafiska element.
- Animation ska förklara hierarki, riktning eller resultat. Undvik dekorativ
  rörelse som konkurrerar med spelet och stöd alltid `prefers-reduced-motion`.
- Prioritera generösa tryckytor, hög kontrast, tydlig textstorlek och robust
  responsiv layout på smala, breda, korta och höga skärmar. Spelet ska vara
  bekvämt även för äldre spelare.
- Återanvänd tokens och mönster från `styles/theme.css.ts` och Vanilla Extract.
  Lägg inte in ett separat designsystem eller spridda engångsfärger när
  befintliga semantiska tokens räcker.
- Översätt känslan till varje vys funktion. Alla ytor ska inte bli overlays,
  glaspaneler eller spelkort; startsida, menyer, resultat och admin ska använda
  samma typografi, färglogik, djup och rörelsekvalitet på ett sätt som passar
  respektive vy.
- Undvik generiska dashboard-rutnät, överdrivet många inramade kort, dekorativa
  badges och visuellt brus. Färre och tydligare element är bättre.
- Vid större visuella ändringar: kontrollera den riktiga renderingen på minst en
  smal mobil, en kort/liggande skärm och desktop innan arbetet räknas som klart.

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

- Svårighetsgraden för dagens spel styrs av `DAILY_DIFFICULTY` i
  `lib/daily.ts`. Kontrollera faktisk kod innan du antar nivå.
- Veckoschemat ligger i `lib/daily-schedule.ts`.
- Startsidan visar veckorytmen som en enkel kalender, inte en rörig
  månadskalender.
- Adminsidan för dagens spel ligger i `pages/daily-admin.tsx` och ska
  uppdateras samtidigt när schema, urval eller dagliga deck-regler ändras.
- Tisdag är sport: `all-sport-sportogonblick`.
- Fredag är musik: `all-entertainment-music`.
- Lördag är Svenska klassiker: `all-swedish-classics-all`.
- Övriga dagar är vanligt dagens spel från hela roten.
- Dagens kortkö låses i Supabase-tabellen `daily_games`. Raden innehåller både
  `card_qids` och, efter migrationen `20260603172000_daily_game_card_snapshots`,
  `card_snapshots`. Appen använder snapshots om de finns, så dagens kort kan
  vara stabila även om deckfiler ändras och deployas senare samma UTC-dag.
- GitHub Actions-workflowet `.github/workflows/lock-daily.yml` låser dagens
  spel automatiskt kl. 00:05 UTC och kan köras manuellt. Det kräver repo
  secrets: `SUPABASE_SERVICE_ROLE_KEY` samt `SUPABASE_URL` eller
  `NEXT_PUBLIC_SUPABASE_URL`.
- Design-, kod- och gamemode-deploys är inte schemalagda av daily-lock-jobbet.
  De kan deployas när som helst; låsningen påverkar bara dagens kortkö.
- `bun run daily:lock` kan köras manuellt för dagens UTC-datum och skriver inte
  över befintlig låsning utan `--force`. Scriptet kräver
  `SUPABASE_SERVICE_ROLE_KEY`.
- Använd `--force` endast för en uttryckligt godkänd engångskorrigering av en
  redan låst dag. Vanliga kort- och deployändringar får inte ändra dagens
  snapshot eller tidigare dagars spel.

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
