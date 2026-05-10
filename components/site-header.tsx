import Link from "next/link";
import * as styles from "../styles/site-header.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link aria-label="VilketÅr hem" className={styles.wordmark} href="/">
          VilketÅr
        </Link>
      </div>
    </header>
  );
}
