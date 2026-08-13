import { supabase } from "./supabase";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  "BNU_SZmUNQroEzCp7UNBubA3-q0q9ddJmc6SicbVpBjVbnAlc4pxgk4ubjSxa8NOq1V7O4ZGUYYdAoLKIHa9WWU";
const SERVICE_WORKER_URL = "/service-worker.js";
const PUSH_SETUP_TIMEOUT_MS = 15_000;

let pushSyncPromise: Promise<void> | null = null;

export type PushNotificationStatus =
  | "default"
  | "denied"
  | "granted"
  | "needs-install"
  | "not-configured"
  | "unsupported";

export class PushNotificationError extends Error {
  code: "needs-install" | "not-configured" | "unsupported" | "unknown";

  constructor(
    message: string,
    code: PushNotificationError["code"] = "unknown",
  ) {
    super(message);
    this.name = "PushNotificationError";
    this.code = code;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
}

function isPushApiAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPushNotificationStatus(): PushNotificationStatus {
  if (typeof window === "undefined") {
    return "unsupported";
  }

  if (!VAPID_PUBLIC_KEY || !supabase) {
    return "not-configured";
  }

  if (isIosDevice() && !isStandalone()) {
    return "needs-install";
  }

  if (!isPushApiAvailable()) {
    return "unsupported";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return Notification.permission === "granted" ? "granted" : "default";
}

function base64UrlToArrayBuffer(value: string): ArrayBuffer {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (character) => character.charCodeAt(0))
    .buffer as ArrayBuffer;
}

function applicationServerKeyMatches(subscription: PushSubscription): boolean {
  const currentKey = subscription.options.applicationServerKey;
  if (!currentKey) {
    return false;
  }

  const expected = new Uint8Array(base64UrlToArrayBuffer(VAPID_PUBLIC_KEY));
  const current = new Uint8Array(currentKey);
  if (expected.length !== current.length) {
    return false;
  }

  return expected.every((value, index) => value === current[index]);
}

function withTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new PushNotificationError(message));
    }, PUSH_SETUP_TIMEOUT_MS);

    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

async function getPushServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  let registration = await withTimeout(
    navigator.serviceWorker.getRegistration(),
    "Notistjänsten svarade inte. Försök igen om en liten stund.",
  );

  if (!registration) {
    registration = await withTimeout(
      navigator.serviceWorker.register(SERVICE_WORKER_URL, {
        updateViaCache: "none",
      }),
      "Kunde inte starta notistjänsten. Försök igen om en liten stund.",
    );
  }

  if (registration.active) {
    return registration;
  }

  return withTimeout(
    navigator.serviceWorker.ready,
    "Notistjänsten startade inte. Ladda om sidan och försök igen.",
  );
}

async function savePushSubscription(
  subscription: PushSubscription,
): Promise<void> {
  if (!supabase) {
    throw new PushNotificationError("Supabase saknas.", "not-configured");
  }

  const subscriptionJson = subscription.toJSON();
  const endpoint = subscriptionJson.endpoint;
  const p256dh = subscriptionJson.keys?.p256dh;
  const auth = subscriptionJson.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    throw new PushNotificationError("Kunde inte läsa push-prenumerationen.");
  }

  const response = await withTimeout(
    supabase.rpc("app_save_push_subscription", {
      p_auth: auth,
      p_endpoint: endpoint,
      p_p256dh: p256dh,
      p_user_agent: navigator.userAgent,
    }),
    "Kunde inte spara notisinställningen. Försök igen om en liten stund.",
  );
  if (response.error) {
    throw response.error;
  }
}

async function synchronizePushSubscription(): Promise<void> {
  if (!supabase) {
    throw new PushNotificationError("Supabase saknas.", "not-configured");
  }

  const registration = await getPushServiceWorkerRegistration();
  let subscription = await withTimeout(
    registration.pushManager.getSubscription(),
    "Kunde inte läsa notisinställningen. Försök igen om en liten stund.",
  );
  let staleEndpoint: string | null = null;

  if (subscription && !applicationServerKeyMatches(subscription)) {
    staleEndpoint = subscription.endpoint;
    await withTimeout(
      subscription.unsubscribe(),
      "Kunde inte uppdatera notisinställningen. Försök igen om en liten stund.",
    );
    subscription = null;
  }

  if (!subscription) {
    subscription = await withTimeout(
      registration.pushManager.subscribe({
        applicationServerKey: base64UrlToArrayBuffer(VAPID_PUBLIC_KEY),
        userVisibleOnly: true,
      }),
      "Kunde inte aktivera liganotiserna. Försök igen om en liten stund.",
    );
  }

  await savePushSubscription(subscription);

  if (staleEndpoint && staleEndpoint !== subscription.endpoint) {
    await supabase
      .rpc("app_remove_push_subscription", { p_endpoint: staleEndpoint })
      .then(
        () => undefined,
        () => undefined,
      );
  }
}

export function syncLeaguePushNotifications(): Promise<void> {
  if (getPushNotificationStatus() !== "granted") {
    return Promise.resolve();
  }

  if (!pushSyncPromise) {
    pushSyncPromise = synchronizePushSubscription().catch((error: unknown) => {
      pushSyncPromise = null;
      throw error;
    });
  }

  return pushSyncPromise;
}

export async function enableLeaguePushNotifications(): Promise<void> {
  const status = getPushNotificationStatus();
  if (status === "needs-install") {
    throw new PushNotificationError(
      "Lägg VilketÅr på hemskärmen först. Öppna sedan appen därifrån för att slå på notiser.",
      "needs-install",
    );
  }

  if (status === "not-configured") {
    throw new PushNotificationError(
      "Notiser är inte konfigurerade ännu.",
      "not-configured",
    );
  }

  if (status === "unsupported") {
    throw new PushNotificationError(
      "Den här webbläsaren stöder inte liganotiser.",
      "unsupported",
    );
  }

  if (!supabase) {
    throw new PushNotificationError("Supabase saknas.", "not-configured");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new PushNotificationError(
      "Notiserna är inte aktiverade. Du kan ändra det i webbläsarens inställningar.",
    );
  }

  await synchronizePushSubscription();
}

export async function disableLeaguePushNotifications(): Promise<void> {
  if (!supabase || !isPushApiAvailable()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) {
    return;
  }

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe().catch(() => false);
  pushSyncPromise = null;
  const response = await supabase.rpc("app_remove_push_subscription", {
    p_endpoint: endpoint,
  });
  if (response.error) {
    throw response.error;
  }
}
