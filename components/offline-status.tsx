import React from "react";
import * as styles from "../styles/offline-status.css";

function readOnlineStatus() {
  return typeof navigator === "undefined" || navigator.onLine;
}

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const syncStatus = () => setIsOnline(readOnlineStatus());

    syncStatus();
    window.addEventListener("online", syncStatus);
    window.addEventListener("offline", syncStatus);

    return () => {
      window.removeEventListener("online", syncStatus);
      window.removeEventListener("offline", syncStatus);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <aside className={styles.status} role="status">
      <span aria-hidden="true" className={styles.dot} />
      <span>Offline – sparar på enheten</span>
    </aside>
  );
}
