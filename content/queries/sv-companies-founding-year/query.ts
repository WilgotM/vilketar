import { defineQuery } from "../../query-definition";

export default defineQuery({
  cards: {
    titleTemplate: (row) => `${row.itemLabel} grundas`,
    subtitleTemplate: "Svenskt företag eller varumärke",
  },
  dirPath: import.meta.dir,
  id: "sv-companies-founding-year",
  minScore: 5,
  title: "Svenska företag efter grundandeår",
});
