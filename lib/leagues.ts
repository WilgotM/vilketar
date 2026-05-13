import { supabase } from "./supabase";

const DISPLAY_NAME_STORAGE_KEY = "leagues:display-name";

export type LeagueMember = {
  daysPlayed: number;
  displayName: string;
  isCurrentUser: boolean;
  memberId: string;
  todayResultPattern: string | null;
  todayScore: number | null;
  weekScore: number;
};

export type LeagueWinner = {
  displayName: string;
  totalScore: number;
};

export type League = {
  createdAt: string;
  currentWeekEndsAt: string;
  currentWeekStartsAt: string;
  firstWeekIsShort: boolean;
  id: string;
  joinCode: string;
  members: LeagueMember[];
  name: string;
  previousWeekWinner: LeagueWinner | null;
};

export type LeagueProfile = {
  displayName: string;
  id: string;
};

export function isLeaguesConfigured(): boolean {
  return supabase !== null;
}

export function loadStoredDisplayName(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(DISPLAY_NAME_STORAGE_KEY) ?? "";
}

export function saveStoredDisplayName(displayName: string) {
  localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, displayName);
}

export async function ensureLeagueProfile(
  displayName: string,
): Promise<LeagueProfile> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    const anonymous = await supabase.auth.signInAnonymously();
    if (anonymous.error) {
      throw anonymous.error;
    }
  }

  const profile = await supabase.rpc("app_set_profile", {
    p_display_name: displayName.trim(),
  });
  if (profile.error) {
    throw profile.error;
  }

  saveStoredDisplayName(displayName.trim());
  return profile.data as LeagueProfile;
}

export async function getMyLeagues(todayDateKey: string): Promise<League[]> {
  if (!supabase) {
    return [];
  }

  const response = await supabase.rpc("app_get_leagues", {
    p_today: todayDateKey,
  });
  if (response.error) {
    throw response.error;
  }

  return (response.data ?? []) as League[];
}

export async function createLeague(name: string): Promise<League> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_create_league", {
    p_name: name.trim(),
  });
  if (response.error) {
    throw response.error;
  }

  return response.data as League;
}

export async function joinLeague(joinCode: string): Promise<League> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_join_league", {
    p_join_code: joinCode.trim().toUpperCase(),
  });
  if (response.error) {
    throw response.error;
  }

  return response.data as League;
}

export async function submitDailyLeagueResult(input: {
  dateKey: string;
  resultPattern: string;
  score: number;
}): Promise<void> {
  if (!supabase) {
    return;
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return;
  }

  const response = await supabase.rpc("app_submit_daily_result", {
    p_date_key: input.dateKey,
    p_result_pattern: input.resultPattern,
    p_score: input.score,
  });
  if (response.error) {
    throw response.error;
  }
}
