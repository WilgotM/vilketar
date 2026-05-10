import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `‘${row.itemLabel}’ släpps`,
    subtitleTemplate: (row) =>
      row.artistLabel ? `Musik av ${row.artistLabel}` : "Musik",
  },
  dirPath: import.meta.dir,
  id: "sv-music-release-year",
  minScore: 5,
  title: "Svensk musik efter utgivningsår",
});
