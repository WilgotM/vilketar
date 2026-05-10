import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `${row.itemLabel} invigs`,
    subtitleTemplate: "Byggnad eller anläggning i Sverige",
  },
  dirPath: import.meta.dir,
  id: "sv-buildings-inception-year",
  minScore: 5,
  title: "Svenska byggnader efter invigningsår",
});
