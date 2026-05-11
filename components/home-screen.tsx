import Image from "next/image";
import ButtonLink from "./button-link";
import PageShell from "./page-shell";
import SiteFooter from "./site-footer";
import SiteHero from "./site-hero";
import * as buttonStyles from "../styles/button.css";
import * as styles from "../styles/home-screen.css";

function ScatterDots() {
  return (
    <div className={styles.scatterDots} aria-hidden="true">
      <div
        className={styles.dot}
        style={{
          background: "#4E9FE5",
          height: 8,
          left: "52%",
          top: "12%",
          width: 8,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#E85D9C",
          height: 6,
          left: "12%",
          top: "62%",
          width: 6,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#4E9FE5",
          height: 7,
          right: "18%",
          top: "52%",
          width: 7,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#F5B731",
          height: 5,
          left: "8%",
          top: "38%",
          width: 5,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#9B59B6",
          height: 6,
          right: "6%",
          top: "68%",
          width: 6,
        }}
      />
    </div>
  );
}

function HeroDecorations() {
  return (
    <div className={styles.heroDecorations} aria-hidden="true">
      {/* City / 1949 */}
      <div className={styles.heroItemCity}>
        <Image
          alt=""
          className={styles.heroImageCity}
          height={240}
          priority
          src="/hero/city-1949.png"
          unoptimized
          width={240}
        />
        <div className={styles.yearBadge1949}>1949</div>
      </div>

      {/* Astronaut / 1969 */}
      <div className={styles.heroItemAstronaut}>
        <Image
          alt=""
          className={styles.heroImageAstronaut}
          height={220}
          priority
          src="/hero/astronaut-1969.png"
          unoptimized
          width={220}
        />
        <div className={styles.yearBadge1969}>1969</div>
      </div>

      {/* Radio / 1962 */}
      <div className={styles.heroItemRadio}>
        <Image
          alt=""
          className={styles.heroImageRadio}
          height={240}
          priority
          src="/hero/radio-1962.png"
          unoptimized
          width={240}
        />
        <div className={styles.yearBadge1962}>1962</div>
      </div>

      {/* Vinyl / 1974 */}
      <div className={styles.heroItemVinyl}>
        <Image
          alt=""
          className={styles.heroImageVinyl}
          height={260}
          priority
          src="/hero/vinyl-1974.png"
          unoptimized
          width={260}
        />
        <div className={styles.yearBadge1974}>1974</div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <PageShell showHeader={false}>
      <div className={styles.home}>
        <ScatterDots />
        <div className={styles.wrapper}>
          <HeroDecorations />
          <div className={styles.stage}>
            <SiteHero subtitle="Placera svenska och historiska händelser i rätt år." />
            <div className={styles.actions}>
              <ButtonLink
                fullWidth
                href="/daily"
                leadingIcon="play"
                text="Dagens spel"
              />
              <ButtonLink
                className={buttonStyles.swedishClassics}
                fullWidth
                href="/party"
                leadingIcon="group"
                text="Sällskapsspel"
              />
              <ButtonLink
                fullWidth
                href="/play"
                leadingIcon="group"
                minimal
                text="Fritt spel"
              />
            </div>
          </div>
          <SiteFooter className={styles.footer} />
        </div>
      </div>
    </PageShell>
  );
}
