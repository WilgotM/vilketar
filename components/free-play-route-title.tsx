import { getSelectionRouteShareLabel } from "../lib/categories";
import { SelectionRoute } from "../types/routes";
import * as styles from "../styles/free-play-selector.css";

interface Props {
  breadcrumbs?: string[];
  selectionRoute?: SelectionRoute;
}

function getLabel(props: Props): string {
  const { breadcrumbs = [], selectionRoute } = props;

  if (selectionRoute) {
    if (selectionRoute.kind === "all") {
      return "Fritt spel / Alla";
    }

    return ["Fritt spel", getSelectionRouteShareLabel(selectionRoute)].join(
      " / ",
    );
  }

  if (breadcrumbs.length > 0) {
    return ["Fritt spel", ...breadcrumbs].join(" / ");
  }

  return "Fritt spel";
}

export default function FreePlayRouteTitle(props: Props) {
  return <div className={styles.sectionTitle}>{getLabel(props)}</div>;
}
