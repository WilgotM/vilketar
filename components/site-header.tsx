import Link from "next/link";
import { useRouter } from "next/router";
import * as styles from "../styles/site-header.css";

interface Props {
  backHref?: string;
  backLabel?: string;
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function SiteHeader(props: Props) {
  const { backHref, backLabel = "Tillbaka" } = props;
  const router = useRouter();

  const href = backHref ?? (router.pathname !== "/" ? "/" : undefined);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {href ? (
          <Link
            aria-label={backLabel}
            className={styles.backLink}
            href={href}
          >
            <BackIcon />
            <span className={styles.backText}>{backLabel}</span>
          </Link>
        ) : null}
        <Link aria-label="VilketÅr hem" className={styles.wordmark} href="/">
          VilketÅr
        </Link>
      </div>
    </header>
  );
}
