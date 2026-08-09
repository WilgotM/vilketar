import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import type { League } from "../lib/leagues";
import * as styles from "../styles/leagues-screen.css";

type Props = {
  busy: boolean;
  copyText: string;
  editingLeagueId: string | null;
  editingLeagueName: string;
  leagues: League[];
  onCopyCode: (code: string) => void;
  onCreate: () => void;
  onDeleteLeague: (league: League) => void;
  onEditingLeagueIdChange: (leagueId: string | null) => void;
  onEditingLeagueNameChange: (name: string) => void;
  onJoin: () => void;
  onRemoveMember: (league: League, memberId: string) => void;
  onRenameLeague: (league: League) => void;
};

type IconProps = {
  size?: number;
};

function PlusIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function JoinIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M14.5 5H19v14h-4.5M3 12h12m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UsersIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19a5.5 5.5 0 0 1 11 0m0-5.5A5 5 0 0 1 21 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LinkIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="m9.5 14.5 5-5m-8 8-1 1a3.54 3.54 0 0 1-5-5l3-3a3.54 3.54 0 0 1 5 0m7-4 1-1a3.54 3.54 0 0 1 5 5l-3 3a3.54 3.54 0 0 1-5 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CopyIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <rect
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
        width="12"
        x="8"
        y="8"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MoreIcon({ size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function getIsoWeekNumber(value: string): number {
  const date = new Date(value);
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const weekday = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
}

function todayLabel(score: number | null): string {
  return score === null ? "Inte spelat idag" : `+${score} idag`;
}

export default function LeagueWorkspace(props: Props) {
  const {
    busy,
    copyText,
    editingLeagueId,
    editingLeagueName,
    leagues,
    onCopyCode,
    onCreate,
    onDeleteLeague,
    onEditingLeagueIdChange,
    onEditingLeagueNameChange,
    onJoin,
    onRemoveMember,
    onRenameLeague,
  } = props;
  const [selectedLeagueId, setSelectedLeagueId] = React.useState<string | null>(
    null,
  );
  const selectedLeague =
    leagues.find((league) => league.id === selectedLeagueId) ??
    leagues[0] ??
    null;

  return (
    <section className={styles.workspace}>
      <aside aria-label="Dina ligor" className={styles.leagueSidebar}>
        <h2 className={styles.sidebarTitle}>Dina ligor</h2>
        <div className={styles.leagueSwitcher}>
          {leagues.map((league) => (
            <button
              aria-pressed={selectedLeague?.id === league.id}
              className={styles.leagueSwitchButton}
              key={league.id}
              onClick={() => setSelectedLeagueId(league.id)}
              type="button"
            >
              <span className={styles.leagueSwitchIcon}>
                <UsersIcon />
              </span>
              <span className={styles.leagueSwitchCopy}>
                <span className={styles.leagueSwitchName}>{league.name}</span>
                <span className={styles.leagueSwitchMeta}>
                  {league.members.length} spelare
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className={styles.leagueActions}>
          <button
            className={styles.primaryLeagueAction}
            onClick={onCreate}
            type="button"
          >
            <PlusIcon />
            <span>Skapa liga</span>
          </button>
          <button
            className={styles.secondaryLeagueAction}
            onClick={onJoin}
            type="button"
          >
            <JoinIcon />
            <span>Gå med</span>
          </button>
        </div>
      </aside>

      <div className={styles.leagueDetail}>
        {selectedLeague ? (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className={styles.leagueCard}
            initial={{ opacity: 0, y: 8 }}
            key={selectedLeague.id}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.leagueHeader}>
              <div className={styles.leagueIdentityIcon}>
                <UsersIcon size={26} />
              </div>
              <div className={styles.leagueTitleStack}>
                {editingLeagueId === selectedLeague.id ? (
                  <div className={styles.renameRow}>
                    <input
                      aria-label="Nytt liganamn"
                      className={styles.compactInput}
                      maxLength={48}
                      onChange={(event) =>
                        onEditingLeagueNameChange(event.target.value)
                      }
                      value={editingLeagueName}
                    />
                    <button
                      className={styles.smallAction}
                      disabled={busy}
                      onClick={() => onRenameLeague(selectedLeague)}
                      type="button"
                    >
                      Spara
                    </button>
                  </div>
                ) : (
                  <h2 className={styles.leagueTitle}>{selectedLeague.name}</h2>
                )}
                <div className={styles.memberCount}>
                  <span>
                    Vecka {getIsoWeekNumber(selectedLeague.currentWeekStartsAt)}
                  </span>
                  <span aria-hidden="true" className={styles.metaDot}>
                    ·
                  </span>
                  <span>{selectedLeague.members.length} spelare</span>
                </div>
              </div>
              <details className={styles.manageMenu}>
                <summary
                  aria-label={`Hantera ${selectedLeague.name}`}
                  className={styles.manageTrigger}
                >
                  <MoreIcon />
                </summary>
                <div className={styles.manageDropdown}>
                  {selectedLeague.canManage ? (
                    <>
                      <button
                        className={styles.manageAction}
                        disabled={busy}
                        onClick={() => {
                          onEditingLeagueIdChange(selectedLeague.id);
                          onEditingLeagueNameChange(selectedLeague.name);
                        }}
                        type="button"
                      >
                        Byt namn
                      </button>
                      <button
                        className={styles.manageActionDanger}
                        disabled={busy}
                        onClick={() => onDeleteLeague(selectedLeague)}
                        type="button"
                      >
                        Ta bort liga
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.manageActionDanger}
                      disabled={busy}
                      onClick={() => {
                        const currentMember = selectedLeague.members.find(
                          (member) => member.isCurrentUser,
                        );
                        if (currentMember) {
                          onRemoveMember(
                            selectedLeague,
                            currentMember.memberId,
                          );
                        }
                      }}
                      type="button"
                    >
                      Lämna liga
                    </button>
                  )}
                </div>
              </details>
            </div>

            <button
              aria-label={`Bjud in till ${selectedLeague.name}. Kopiera koden ${selectedLeague.joinCode}`}
              className={styles.inviteAction}
              onClick={() => onCopyCode(selectedLeague.joinCode)}
              type="button"
            >
              <span className={styles.inviteLabel}>
                <LinkIcon />
                <span>Bjud in</span>
                <span aria-hidden="true" className={styles.metaDot}>
                  ·
                </span>
                <span className={styles.inviteCode}>
                  {selectedLeague.joinCode}
                </span>
              </span>
              <span className={styles.copyFeedback}>
                <span
                  className={
                    copyText === "Kopierad"
                      ? styles.copyFeedbackTextVisible
                      : styles.copyFeedbackText
                  }
                >
                  {copyText}
                </span>
                <CopyIcon />
              </span>
            </button>

            {selectedLeague.firstWeekIsShort ? (
              <div className={styles.notice}>
                <span aria-hidden="true" className={styles.noticeIcon}>
                  i
                </span>
                <span>
                  Första veckan räknas från skapelsedagen till söndag.
                </span>
              </div>
            ) : null}

            {selectedLeague.previousWeekWinner ? (
              <div className={styles.winner}>
                <div>
                  <div className={styles.winnerLabel}>
                    Förra veckans vinnare
                  </div>
                  <div className={styles.winnerName}>
                    {selectedLeague.previousWeekWinner.displayName}
                  </div>
                </div>
                <div className={styles.winnerScore}>
                  {selectedLeague.previousWeekWinner.totalScore} poäng
                </div>
              </div>
            ) : null}

            <div className={styles.memberList}>
              <div className={styles.memberListHeader}>
                <div>#</div>
                <div>Namn</div>
                <div className={styles.scoreHeading}>Poäng</div>
              </div>
              {[...selectedLeague.members]
                .sort((a, b) => b.weekScore - a.weekScore)
                .map((member, index) => (
                  <div
                    className={`${styles.memberRow} ${
                      member.isCurrentUser ? styles.memberRowCurrent : ""
                    }`}
                    key={member.memberId}
                  >
                    <div
                      className={`${styles.memberRank} ${
                        index === 0 ? styles.memberRankFirst : ""
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberName}>
                        <span className={styles.memberAvatar}>
                          {member.avatarDataUrl ? (
                            <Image
                              alt=""
                              className={styles.avatarImage}
                              height={44}
                              src={member.avatarDataUrl}
                              unoptimized
                              width={44}
                            />
                          ) : (
                            member.displayName.trim().charAt(0).toUpperCase() ||
                            "?"
                          )}
                        </span>
                        <span className={styles.memberDisplayName}>
                          {member.displayName}
                        </span>
                        {member.isCurrentUser ? (
                          <span className={styles.youLabel}>Du</span>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.scoreCell}>
                      <div className={styles.score}>
                        {member.weekScore}{" "}
                        <span className={styles.scoreUnit}>poäng</span>
                      </div>
                      <div className={styles.today}>
                        {todayLabel(member.todayScore)}
                      </div>
                      {selectedLeague.canManage && !member.isCurrentUser ? (
                        <button
                          className={styles.kickButton}
                          disabled={busy}
                          onClick={() =>
                            onRemoveMember(selectedLeague, member.memberId)
                          }
                          type="button"
                        >
                          Ta bort
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
            </div>
          </motion.article>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <UsersIcon size={28} />
            </div>
            <h2 className={styles.emptyTitle}>Skapa din första liga</h2>
            <p className={styles.emptyCopy}>
              Bjud in vänner och jämför era poäng under veckan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
