import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `${row.itemLabel} dör`,
    subtitleTemplate: (row) => row.description || "Svensk person",
  },
  dirPath: import.meta.dir,
  id: "sv-people-death-year",
  minScore: 10,
  title: "Svenskar efter dödsår",
});
