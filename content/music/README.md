# Musikbibliotek

`vilketar-music-candidates.json` är källfilen för musikleken. Varje rad måste
ha ett Spotify-id, låttitel, artist och låtens första utgivningsår. Årtalet ska
inte vara året för en senare remaster, samlingsskiva eller återutgivning.

Arbetsflöde:

1. Kör `bun run decks:enrich-music-years` för att kontrollera första
   utgivningsår mot MusicBrainz.
2. Kör vid behov `bun run decks:enrich-music` för att i långsam takt fylla på
   Apple Music-länkar, omslag och förhandslyssningar. Befintliga träffar hoppas
   över.
3. Kör `bun run decks:music` för att bygga
   `public/decks/all-entertainment-music.json` och uppdatera deck-indexet.

Apple-uppslaget vid byggtid är en cache och behöver inte täcka alla låtar.
Webbappen söker också i den svenska Apple-katalogen när ett låtkort visas och
sparar resultatet i webbläsaren under den pågående spelomgången.
