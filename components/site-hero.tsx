import * as ui from "../styles/ui.css";

interface Props {
  subtitle: string;
}

export default function SiteHero(_props: Props) {
  return (
    <div className={ui.heroStack}>
      <h1 className={ui.heroWordmark}>
        Vilket
        <span className={ui.heroWordmarkAccent}>
          <span className={ui.heroWordmarkRays}>✦</span>
          År
        </span>
      </h1>
      <p className={ui.heroTagline}>
        Placera svenska och historiska
        <br />
        händelser i <span className={ui.heroTaglineBold}>rätt år.</span>
      </p>
    </div>
  );
}
