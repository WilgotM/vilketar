export type DailyScheduleTheme = {
  deckId: string | null;
  label: string;
  shortLabel: string;
};

export type DailyScheduleDay = DailyScheduleTheme & {
  dayLabel: string;
  weekday: number;
};

const DEFAULT_THEME: DailyScheduleTheme = {
  deckId: null,
  label: "Vanligt",
  shortLabel: "Vanligt",
};

const SCHEDULED_THEMES: Partial<Record<number, DailyScheduleTheme>> = {
  2: {
    deckId: "all-sport-sportogonblick",
    label: "Sport",
    shortLabel: "Sport",
  },
  5: {
    deckId: "all-entertainment-music",
    label: "Musik",
    shortLabel: "Musik",
  },
  6: {
    deckId: "all-swedish-classics-all",
    label: "Svenska klassiker",
    shortLabel: "Klassiker",
  },
};

const WEEKDAY_LABELS = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

function getUtcWeekdayFromDateKey(dateKey: string): number {
  return new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
}

export function getDailyScheduleTheme(dateKey: string): DailyScheduleTheme {
  return SCHEDULED_THEMES[getUtcWeekdayFromDateKey(dateKey)] ?? DEFAULT_THEME;
}

export function getDailyScheduleWeek(): DailyScheduleDay[] {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({
    ...DEFAULT_THEME,
    ...(SCHEDULED_THEMES[weekday] ?? {}),
    dayLabel: WEEKDAY_LABELS[weekday],
    weekday,
  }));
}

export function getDailyScheduleWeekday(dateKey: string): number {
  return getUtcWeekdayFromDateKey(dateKey);
}
