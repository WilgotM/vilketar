import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `‘${row.itemLabel}’ börjar sändas`,
    subtitleTemplate: "Svenskt tv-program",
  },
  dirPath: import.meta.dir,
  id: "sv-tv-shows-start-year",
  minScore: 5,
  title: "Svenska tv-program efter startår",
});
