import type { LeagueMember } from "./leagues";

type DailyLeagueSource = {
  members: Array<
    Pick<
      LeagueMember,
      | "avatarDataUrl"
      | "displayName"
      | "isCurrentUser"
      | "memberId"
      | "todayScore"
    >
  >;
  name: string;
};

export type DailyLeagueScore = {
  avatarDataUrl: string | null;
  displayName: string;
  id: string;
  leagueNames: string[];
  score: number;
};

export function getDailyLeagueStripMode(
  hasLeagues: boolean,
  scores: DailyLeagueScore[],
): "hidden" | "empty" | "scores" {
  if (!hasLeagues) {
    return "hidden";
  }

  return scores.length === 0 ? "empty" : "scores";
}

function normalizeDisplayName(displayName: string): string {
  return displayName.trim().replace(/\s+/g, " ").toLocaleLowerCase("sv");
}

function getPersonKey(member: DailyLeagueSource["members"][number]): string {
  const normalizedName = normalizeDisplayName(member.displayName);

  if (member.avatarDataUrl) {
    return `profile:${normalizedName}:${member.avatarDataUrl}`;
  }

  return normalizedName
    ? `name:${normalizedName}:score:${member.todayScore}`
    : `member:${member.memberId}`;
}

export function getCompactLeagueName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] || displayName;
}

export function collectDailyLeagueScores(
  leagues: DailyLeagueSource[],
): DailyLeagueScore[] {
  const scoresByPerson = new Map<string, DailyLeagueScore>();

  for (const league of leagues) {
    for (const member of league.members) {
      if (member.isCurrentUser || member.todayScore === null) {
        continue;
      }

      const personKey = getPersonKey(member);
      const existing = scoresByPerson.get(personKey);

      if (existing) {
        existing.score = Math.max(existing.score, member.todayScore);
        if (!existing.leagueNames.includes(league.name)) {
          existing.leagueNames.push(league.name);
        }
        continue;
      }

      scoresByPerson.set(personKey, {
        avatarDataUrl: member.avatarDataUrl,
        displayName: member.displayName.trim(),
        id: member.memberId,
        leagueNames: [league.name],
        score: member.todayScore,
      });
    }
  }

  return [...scoresByPerson.values()].sort(
    (left, right) =>
      right.score - left.score ||
      left.displayName.localeCompare(right.displayName, "sv"),
  );
}
