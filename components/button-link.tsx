import classNames from "classnames";
import Link from "next/link";
import * as styles from "../styles/button.css";

interface Props {
  className?: string;
  fullWidth?: boolean;
  href: string;
  leadingIcon?: "play" | "group";
  minimal?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  trailingIcon?: "chevron" | "play";
  text: string;
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LeadingIcon(props: { icon: "play" | "group" }) {
  const { icon } = props;

  if (icon === "play") {
    return <PlayIcon />;
  }

  return <GroupIcon />;
}

function TrailingIcon(props: { icon: "chevron" | "play" }) {
  const { icon } = props;

  if (icon === "play") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        viewBox="0 0 14 14"
        width="14"
      >
        <path d="M4.5 3.2V10.8L10.6 7L4.5 3.2Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <path
        d="M5 3L9 7L5 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function ButtonLink(props: Props) {
  const {
    className,
    fullWidth = false,
    href,
    leadingIcon,
    minimal = false,
    onClick,
    text,
    trailingIcon,
  } = props;

  return (
    <Link
      className={classNames(
        styles.button,
        {
          [styles.fullWidth]: fullWidth,
          [styles.minimal]: minimal,
          [styles.withTrailingIcon]: trailingIcon,
        },
        className,
      )}
      href={href}
      onClick={onClick}
      prefetch
    >
      <span className={styles.content}>
        {leadingIcon ? (
          <span className={styles.icon}>
            <LeadingIcon icon={leadingIcon} />
          </span>
        ) : null}
        <span className={styles.label}>{text}</span>
        {trailingIcon ? (
          <span className={styles.icon}>
            <TrailingIcon icon={trailingIcon} />
          </span>
        ) : null}
      </span>
    </Link>
  );
}
