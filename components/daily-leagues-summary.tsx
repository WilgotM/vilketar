import Link from "next/link";
import React from "react";
import { getMyLeagues, hasLeagueSession, League } from "../lib/leagues";
import * as styles from "../styles/daily-completed-summary.css";

interface Props {
  dateKey: string;
}

function scoreLabel(score: number | null): string {
  return score === null ? "Inte spelat" : `${score} p`;
}

export default function DailyLeaguesSummary({ dateKey }: Props) {
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function loadLeagues() {
      try {
        const hasSession = await hasLeagueSession();
        if (!hasSession) {
          return;
        }

        const nextLeagues = await getMyLeagues(dateKey);
        if (mounted) {
          setLeagues(nextLeagues);
        }
      } catch {
        if (mounted) {
          setLeagues([]);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    void loadLeagues();

    return () => {
      mounted = false;
    };
  }, [dateKey]);

  if (!ready) {
    return null;
  }

  if (leagues.length === 0) {
    return (
      <div className={styles.leagueTip}>
        <div>
          <div className={styles.leagueTipTitle}>Spela med familjen</div>
          <p className={styles.leagueTipText}>
            Skapa en liga eller gå med med en kod. Då ser ni allas resultat här
            efter dagens spel.
          </p>
        </div>
        <Link className={styles.leagueLink} href="/leagues">
          Öppna ligor
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.leagueResults}>
      <div className={styles.leagueResultsHeader}>
        <div>
          <div className={styles.leagueTipTitle}>Dina ligor idag</div>
          <div className={styles.leagueTipText}>
            Enkelt att jämföra med de du spelar med.
          </div>
        </div>
        <Link className={styles.leagueLink} href="/leagues">
          Visa alla
        </Link>
      </div>
      <div className={styles.leagueStack}>
        {leagues.slice(0, 2).map((league) => (
          <section className={styles.dailyLeagueCard} key={league.id}>
            <div className={styles.dailyLeagueName}>{league.name}</div>
            <div className={styles.dailyLeagueMembers}>
              {league.members.slice(0, 4).map((member, index) => (
                <div className={styles.dailyLeagueRow} key={member.memberId}>
                  <div className={styles.dailyLeagueRank}>{index + 1}</div>
                  <div className={styles.dailyLeaguePerson}>
                    {member.displayName}
                    {member.isCurrentUser ? (
                      <span className={styles.dailyYouBadge}>du</span>
                    ) : null}
                  </div>
                  <div className={styles.dailyLeagueScore}>
                    {scoreLabel(member.todayScore)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
