import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `‘${row.itemLabel}’ har premiär`,
    subtitleTemplate: (row) =>
      row.directorLabel ? `Film av ${row.directorLabel}` : "Svensk film",
  },
  dirPath: import.meta.dir,
  id: "sv-films-release-year",
  minScore: 5,
  title: "Svenska filmer efter premiärår",
});
