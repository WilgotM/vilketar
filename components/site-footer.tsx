import classNames from "classnames";
import * as ui from "../styles/ui.css";

interface Props {
  className?: string;
}

export default function SiteFooter(props: Props) {
  const { className } = props;

  return (
    <div className={classNames(ui.footerNotes, className)}>
      <div>
        Data hämtas från{" "}
        <a
          href="https://www.wikidata.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wikidata
        </a>{" "}
        och{" "}
        <a
          href="https://sv.wikipedia.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          svenska Wikipedia
        </a>
        .
      </div>
      <div>
        Kodbasen bygger på Wikitrivia och används enligt MIT-licensen. Fel i
        fakta rättas bäst vid källan på{" "}
        <a
          href="https://www.wikidata.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wikidata
        </a>
        .
      </div>
    </div>
  );
}
