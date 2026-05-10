const YEAR_PATTERN = String.raw`(?:-?\b(?:[3-9]\d{2}|1\d{3}|20\d{2})\b)`;
const YEAR_RANGE_PATTERN = new RegExp(
  String.raw`\b(?:mellan|between|från|from)?\s*${YEAR_PATTERN}\s*(?:-|–|—|−|till|och|and|/)\s*${YEAR_PATTERN}\b`,
  "giu",
);
const CENTURY_PATTERN =
  /\b(?:\d{2,4}-(?:tal|talet|tals)|\d{1,2}:e\s+århundradet)\b/giu;
const SINGLE_YEAR_PATTERN = new RegExp(YEAR_PATTERN, "giu");

function normalizeFrontText(value: string): string {
  return value
    .replaceAll(/\s+/g, " ")
    .replaceAll(/\s+([,.;:!?])/g, "$1")
    .replaceAll(/([([])\s+/g, "$1")
    .replaceAll(/\s+([)\]])/g, "$1")
    .replaceAll(/\s*(?:-|–|—|−)\s*$/g, "")
    .replaceAll(/\s+\b(?:under|mellan|från|from|between)\s*$/giu, "")
    .replaceAll(/\(\s*\)/g, "")
    .replaceAll(/\[\s*\]/g, "")
    .replaceAll(/\s*,\s*(?=[,.;:]|$)/g, "")
    .replaceAll(/\s*(?:,|;|:)\s*$/g, "")
    .replaceAll(/\s+\./g, ".")
    .trim();
}

export function hideYearsOnCardFront(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return normalizeFrontText(
    value
      .replaceAll(YEAR_RANGE_PATTERN, "")
      .replaceAll(CENTURY_PATTERN, "")
      .replaceAll(SINGLE_YEAR_PATTERN, ""),
  );
}
