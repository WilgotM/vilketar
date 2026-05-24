import { supabase } from "./supabase";

const DISPLAY_NAME_STORAGE_KEY = "leagues:display-name";
const DEVICE_ID_STORAGE_KEY = "leagues:device-id";
const AUTH_REQUEST_TIMEOUT_MS = 15000;

export type LeagueMember = {
  avatarDataUrl: string | null;
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
  canManage: boolean;
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
  avatarDataUrl: string | null;
  displayName: string;
  id: string;
};

export type LeagueAuthState = {
  email: string;
  isAnonymous: boolean;
  isSignedIn: boolean;
};

export type StoredDailyResult = {
  dateKey: string;
  resultPattern: string;
  score: number;
};

export type LeagueDevice = {
  createdAt: string;
  deviceId: string;
  deviceName: string;
  isCurrentDevice: boolean;
  lastSeenAt: string;
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

async function withAuthTimeout<T>(request: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              "Det tog för lång tid att nå inloggningen. Kontrollera uppkopplingen och försök igen.",
            ),
          );
        }, AUTH_REQUEST_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function hasLeagueSession(): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const session = await supabase.auth.getSession();
  return Boolean(session.data.session);
}

export async function getLeagueAuthState(): Promise<LeagueAuthState> {
  if (!supabase) {
    return { email: "", isAnonymous: false, isSignedIn: false };
  }

  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) {
    return { email: "", isAnonymous: false, isSignedIn: false };
  }

  return {
    email: user.data.user.email ?? "",
    isAnonymous: user.data.user.is_anonymous ?? false,
    isSignedIn: true,
  };
}

function getStoredDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existingDeviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingDeviceId) {
    return existingDeviceId;
  }

  const nextDeviceId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId);
  return nextDeviceId;
}

function getDeviceName(): string {
  if (typeof navigator === "undefined") {
    return "Okänd enhet";
  }

  if (/iphone/i.test(navigator.userAgent)) {
    return "iPhone";
  }
  if (/ipad/i.test(navigator.userAgent)) {
    return "iPad";
  }
  if (/android/i.test(navigator.userAgent)) {
    return "Android";
  }

  return navigator.platform || "Den här enheten";
}

export async function registerLeagueDevice(): Promise<void> {
  if (!supabase) {
    return;
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return;
  }

  const response = await supabase.rpc("app_register_device", {
    p_device_id: getStoredDeviceId(),
    p_device_name: getDeviceName(),
  });
  if (response.error) {
    throw response.error;
  }
}

export async function getLeagueDevices(): Promise<LeagueDevice[]> {
  if (!supabase) {
    return [];
  }

  await registerLeagueDevice();
  const response = await supabase.rpc("app_get_devices", {
    p_current_device_id: getStoredDeviceId(),
  });
  if (response.error) {
    throw response.error;
  }

  return (response.data ?? []) as LeagueDevice[];
}

export async function forgetLeagueDevice(deviceId: string): Promise<void> {
  if (!supabase) {
    return;
  }

  const response = await supabase.rpc("app_forget_device", {
    p_device_id: deviceId,
  });
  if (response.error) {
    throw response.error;
  }
}

export async function saveLeagueAccount(input: {
  email: string;
  password: string;
}): Promise<LeagueAuthState> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const session = await supabase.auth.getSession();
  const email = input.email.trim();
  const password = input.password.trim();
  const currentUser = session.data.session?.user;
  const emailRedirectTo =
    typeof window === "undefined"
      ? undefined
      : `${window.location.origin}/leagues`;

  if (session.data.session) {
    const userAttributes =
      currentUser?.is_anonymous || !currentUser?.email
        ? { email }
        : { email, password };
    const response = await withAuthTimeout(
      supabase.auth.updateUser(userAttributes, { emailRedirectTo }),
    );
    if (response.error) {
      throw response.error;
    }
    return getLeagueAuthState();
  }

  const response = await withAuthTimeout(
    supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    }),
  );
  if (response.error) {
    throw response.error;
  }
  return getLeagueAuthState();
}

export async function signInToLeagueAccount(input: {
  email: string;
  password: string;
}): Promise<LeagueAuthState> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password.trim(),
  });
  if (response.error) {
    throw response.error;
  }

  await registerLeagueDevice();
  return getLeagueAuthState();
}

export async function sendLeaguePasswordReset(email: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const redirectTo =
    typeof window === "undefined"
      ? undefined
      : `${window.location.origin}/leagues`;
  const response = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });
  if (response.error) {
    throw response.error;
  }
}

export async function updateLeaguePassword(password: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.auth.updateUser({
    password: password.trim(),
  });
  if (response.error) {
    throw response.error;
  }
}

export async function signOutLeagueAccount(): Promise<void> {
  if (!supabase) {
    return;
  }

  const response = await supabase.auth.signOut();
  if (response.error) {
    throw response.error;
  }
}

export async function deleteLeagueAccount(): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_delete_account");
  if (response.error) {
    throw response.error;
  }

  await supabase.auth.signOut();
}

export async function getLeagueProfile(): Promise<LeagueProfile | null> {
  if (!supabase) {
    return null;
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return null;
  }

  const response = await supabase.rpc("app_get_profile");
  if (response.error) {
    throw response.error;
  }

  return response.data as LeagueProfile | null;
}

export async function ensureLeagueProfile(input: {
  avatarDataUrl?: string | null;
  displayName: string;
}): Promise<LeagueProfile> {
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
  await registerLeagueDevice();

  const profile = await supabase.rpc("app_set_profile", {
    p_avatar_data_url: input.avatarDataUrl ?? null,
    p_display_name: input.displayName.trim(),
  });
  if (profile.error) {
    throw profile.error;
  }

  saveStoredDisplayName(input.displayName.trim());
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

export async function updateLeagueName(input: {
  leagueId: string;
  name: string;
}): Promise<League> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_update_league_name", {
    p_league_id: input.leagueId,
    p_name: input.name.trim(),
  });
  if (response.error) {
    throw response.error;
  }

  return response.data as League;
}

export async function removeLeagueMember(input: {
  leagueId: string;
  memberId: string;
}): Promise<League | null> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_remove_league_member", {
    p_league_id: input.leagueId,
    p_member_id: input.memberId,
  });
  if (response.error) {
    throw response.error;
  }

  return response.data as League | null;
}

export async function deleteLeague(leagueId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase är inte konfigurerat.");
  }

  const response = await supabase.rpc("app_delete_league", {
    p_league_id: leagueId,
  });
  if (response.error) {
    throw response.error;
  }
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
}): Promise<StoredDailyResult | null> {
  if (!supabase) {
    return null;
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return null;
  }

  const response = await supabase.rpc("app_submit_daily_result", {
    p_date_key: input.dateKey,
    p_result_pattern: input.resultPattern,
    p_score: input.score,
  });
  if (response.error) {
    throw response.error;
  }

  return response.data as StoredDailyResult | null;
}

export async function getStoredDailyResult(
  dateKey: string,
): Promise<StoredDailyResult | null> {
  if (!supabase) {
    return null;
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    return null;
  }

  const response = await supabase
    .from("daily_results")
    .select("date_key, result_pattern, score")
    .eq("user_id", session.data.session.user.id)
    .eq("date_key", dateKey)
    .maybeSingle();
  if (response.error) {
    throw response.error;
  }

  if (!response.data) {
    return null;
  }

  return {
    dateKey: response.data.date_key,
    resultPattern: response.data.result_pattern,
    score: response.data.score,
  };
}
