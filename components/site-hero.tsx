import classNames from "classnames";
import Image from "next/image";
import * as ui from "../styles/ui.css";

interface Props {
  compactLandscape?: boolean;
  subtitle: string;
}

export default function SiteHero(props: Props) {
  const { compactLandscape = false } = props;

  return (
    <div
      className={classNames(
        ui.heroStack,
        compactLandscape && ui.heroStackCompactLandscape,
      )}
    >
      <div className={ui.heroLogoWrapper}>
        <Image
          src="/logo-transparent.svg"
          alt="VilketÅr logotyp"
          width={120}
          height={120}
          priority
          className={classNames(
            ui.heroLogo,
            compactLandscape && ui.heroLogoCompactLandscape,
          )}
        />
      </div>
      <h1
        className={classNames(
          ui.heroWordmark,
          compactLandscape && ui.heroWordmarkCompactLandscape,
        )}
      >
        Vilket
        <span className={ui.heroWordmarkAccent}>
          <span className={ui.heroWordmarkRays}>✦</span>
          År
        </span>
      </h1>
      <p
        className={classNames(
          ui.heroTagline,
          compactLandscape && ui.heroTaglineCompactLandscape,
        )}
      >
        Placera svenska och historiska
        <br />
        händelser i <span className={ui.heroTaglineBold}>rätt år.</span>
      </p>
    </div>
  );
}
