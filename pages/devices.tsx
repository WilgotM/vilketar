import React from "react";
import AppHead from "../components/app-head";
import PageShell from "../components/page-shell";
import {
  forgetLeagueDevice,
  getLeagueAuthState,
  getLeagueDevices,
  LeagueDevice,
} from "../lib/leagues";
import * as styles from "../styles/leagues-screen.css";

function formatSeen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function DevicesPage() {
  const [devices, setDevices] = React.useState<LeagueDevice[]>([]);
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshDevices = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const authState = await getLeagueAuthState();
      setEmail(authState.email);
      if (!authState.isSignedIn) {
        setDevices([]);
        return;
      }

      setDevices(await getLeagueDevices());
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Kunde inte hämta enheterna.",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshDevices();
  }, [refreshDevices]);

  const forgetDevice = React.useCallback(
    async (deviceId: string) => {
      setBusy(true);
      setError(null);
      try {
        await forgetLeagueDevice(deviceId);
        await refreshDevices();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Kunde inte ta bort enheten.",
        );
      } finally {
        setBusy(false);
      }
    },
    [refreshDevices],
  );

  return (
    <>
      <AppHead
        canonicalPath="/devices"
        description="Hantera enheter som är kopplade till ditt VilketÅr-konto."
        noindex
        title="Mina enheter | VilketÅr"
      />
      <PageShell>
        <div className={styles.screen}>
          <section className={styles.hero}>
            <div className={styles.eyebrow}>Konto</div>
            <h1 className={styles.title}>Mina enheter</h1>
            <p className={styles.intro}>
              Här ser du var ditt konto har använts för ligor.
            </p>
          </section>

          {error ? <div className={styles.error}>{error}</div> : null}

          <section className={styles.panel}>
            <div>
              <h2 className={styles.formTitle}>
                {email ? email : "Inte inloggad"}
              </h2>
              <p className={styles.helperText}>
                Om en gammal mobil inte används längre kan du ta bort den från
                listan.
              </p>
            </div>

            {busy ? (
              <div className={styles.empty}>Hämtar enheter...</div>
            ) : null}

            {!busy && devices.length === 0 ? (
              <div className={styles.empty}>
                Logga in på ligasidan för att se dina enheter.
              </div>
            ) : null}

            <div className={styles.deviceList}>
              {devices.map((device) => (
                <article className={styles.deviceRow} key={device.deviceId}>
                  <div>
                    <div className={styles.deviceName}>
                      {device.deviceName}
                      {device.isCurrentDevice ? (
                        <span className={styles.youBadge}>den här</span>
                      ) : null}
                    </div>
                    <div className={styles.today}>
                      Senast använd: {formatSeen(device.lastSeenAt)}
                    </div>
                  </div>
                  <button
                    className={styles.textActionDanger}
                    disabled={busy}
                    onClick={() => void forgetDevice(device.deviceId)}
                    type="button"
                  >
                    Ta bort
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </PageShell>
    </>
  );
}
