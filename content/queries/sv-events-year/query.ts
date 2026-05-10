import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `${row.itemLabel} inträffar`,
    subtitleTemplate: (row) =>
      row.description || "Händelse med svensk koppling",
  },
  dirPath: import.meta.dir,
  id: "sv-events-year",
  minScore: 5,
  title: "Händelser med svensk koppling",
});
