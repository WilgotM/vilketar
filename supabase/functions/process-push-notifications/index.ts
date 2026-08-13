import { createClient } from "npm:@supabase/supabase-js@2.105.4";
import webpush from "npm:web-push@3.6.7";

type QueueRow = {
  actor_display_name: string;
  date_key: string;
  id: string;
  recipient_user_id: string;
  score: number;
};

type PushSubscriptionRow = {
  auth: string;
  endpoint: string;
  id: string;
  p256dh: string;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
const pushCronSecret = Deno.env.get("PUSH_CRON_SECRET");
const configuredSecretKeys = [
  Deno.env.get("SUPABASE_SECRET_KEY"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
];
try {
  const namedSecretKeys = JSON.parse(
    Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}",
  );
  if (namedSecretKeys && typeof namedSecretKeys === "object") {
    configuredSecretKeys.push(
      ...Object.values(namedSecretKeys).filter(
        (value): value is string => typeof value === "string",
      ),
    );
  }
} catch {
  // The single-key environment variables are enough on older projects.
}

const secretKeys = configuredSecretKeys.filter((value): value is string =>
  Boolean(value),
);
const serviceRoleKey = secretKeys[0];

if (!supabaseUrl || !serviceRoleKey || !vapidPrivateKey) {
  throw new Error(
    "Push-funktionen saknar Supabase- eller VAPID-konfiguration.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@vilketar.se",
  "BNU_SZmUNQroEzCp7UNBubA3-q0q9ddJmc6SicbVpBjVbnAlc4pxgk4ubjSxa8NOq1V7O4ZGUYYdAoLKIHa9WWU",
  vapidPrivateKey,
);

function isAuthorized(request: Request): boolean {
  if (
    pushCronSecret &&
    request.headers.get("x-push-cron-secret") === pushCronSecret
  ) {
    return true;
  }

  const apiKey = request.headers.get("apikey");
  const authorization = request.headers.get("authorization");
  return (
    secretKeys.includes(apiKey ?? "") ||
    secretKeys.includes(authorization?.replace(/^Bearer /, "") ?? "")
  );
}

function describePushError(error: unknown): {
  message: string;
  statusCode: number | null;
} {
  if (typeof error !== "object" || error === null) {
    return { message: String(error), statusCode: null };
  }

  const statusCode =
    "statusCode" in error && typeof error.statusCode === "number"
      ? error.statusCode
      : null;
  const errorMessage =
    error instanceof Error ? error.message : "Kunde inte skicka notisen.";
  const responseBody =
    "body" in error && typeof error.body === "string"
      ? error.body.trim().slice(0, 500)
      : "";
  const details = [
    statusCode === null ? null : `HTTP ${statusCode}`,
    errorMessage,
    responseBody || null,
  ].filter((value): value is string => Boolean(value));

  return { message: details.join(": "), statusCode };
}

async function claimRow(row: QueueRow): Promise<boolean> {
  const staleClaimCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("league_push_notifications")
    .update({ claimed_at: new Date().toISOString() })
    .eq("id", row.id)
    .is("sent_at", null)
    .or("claimed_at.is.null,claimed_at.lt." + staleClaimCutoff)
    .select("id")
    .maybeSingle();

  return !error && Boolean(data);
}

async function finishRow(
  row: QueueRow,
  input: { error?: string; sent: boolean },
) {
  const { data: current } = await supabase
    .from("league_push_notifications")
    .select("attempt_count")
    .eq("id", row.id)
    .maybeSingle();
  const attemptCount = Number(current?.attempt_count ?? 0) + 1;

  const update: Record<string, string | number | null> = {
    attempt_count: attemptCount,
    claimed_at: null,
    last_error: input.error ?? null,
  };
  if (input.sent || attemptCount >= 5) {
    update.sent_at = new Date().toISOString();
  }

  await supabase
    .from("league_push_notifications")
    .update(update)
    .eq("id", row.id);
}

async function processRow(row: QueueRow) {
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", row.recipient_user_id);

  if (error) {
    await finishRow(row, { error: error.message, sent: false });
    return;
  }

  const activeSubscriptions = (subscriptions ?? []) as PushSubscriptionRow[];
  if (activeSubscriptions.length === 0) {
    await finishRow(row, {
      error: "Mottagaren har inga aktiva notiser.",
      sent: true,
    });
    return;
  }

  const payload = JSON.stringify({
    title: "Vänligor",
    body: `${row.actor_display_name} spelade dagens spel och fick ${row.score} poäng.`,
    data: { dateKey: row.date_key, url: "/leagues" },
    tag: `league-score-${row.id}`,
  });
  let delivered = false;
  let lastError = "Kunde inte skicka notisen.";

  for (const subscription of activeSubscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { auth: subscription.auth, p256dh: subscription.p256dh },
        },
        payload,
        { TTL: 86_400 },
      );
      delivered = true;
      await supabase
        .from("push_subscriptions")
        .update({ last_success_at: new Date().toISOString() })
        .eq("id", subscription.id);
    } catch (caughtError) {
      const pushError = describePushError(caughtError);
      const statusCode = pushError.statusCode;
      lastError = pushError.message;
      console.error("Push delivery failed", {
        error: lastError,
        provider: new URL(subscription.endpoint).hostname,
      });

      if (statusCode === 404 || statusCode === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("id", subscription.id);
      }
    }
  }

  await finishRow(row, {
    error: delivered ? undefined : lastError,
    sent: delivered,
  });
}

Deno.serve(async (request) => {
  if (request.method !== "POST" || !isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("league_push_notifications")
    .select("id, recipient_user_id, actor_display_name, date_key, score")
    .is("sent_at", null)
    .or(
      "claimed_at.is.null,claimed_at.lt." +
        new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    )
    .lt("attempt_count", 5)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  let processed = 0;
  for (const row of (rows ?? []) as QueueRow[]) {
    if (!(await claimRow(row))) {
      continue;
    }
    await processRow(row);
    processed += 1;
  }

  return Response.json({ processed });
});
