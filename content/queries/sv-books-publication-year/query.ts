import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `‘${row.itemLabel}’ ges ut`,
    subtitleTemplate: (row) =>
      row.authorLabel ? `Bok av ${row.authorLabel}` : "Svenskspråkig bok",
  },
  dirPath: import.meta.dir,
  id: "sv-books-publication-year",
  minScore: 5,
  title: "Svenskspråkiga böcker efter utgivningsår",
});
