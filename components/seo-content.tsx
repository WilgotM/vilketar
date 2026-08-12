import Link from "next/link";
import * as styles from "../styles/seo-content.css";

export function PartySeoContent() {
  return (
    <section
      aria-labelledby="party-seo-title"
      className={styles.section}
      id="om-sallskapsspelet"
    >
      <div className={styles.eyebrow}>Sällskapsspel online</div>
      <h2 className={styles.title} id="party-seo-title">
        Ett sällskapsspel om årtal
      </h2>
      <p className={styles.copy}>
        Vill ni spela ett enkelt tidslinjespel tillsammans? I VilketÅrs
        sällskapsspel turas lagen om att placera historiska händelser, musik,
        sport och svenska klassiker i rätt år. Det är gratis, kräver ingen
        installation och fungerar på mobil, dator och TV.
      </p>
      <p className={styles.copy}>
        Letar du efter ett sällskapsspel i samma anda som När då då? VilketÅr är
        ett fristående alternativ med egna kort och en svensk webbaserad
        spelplan – inspirerat av glädjen i att minnas när saker hände, men inte
        kopplat till eller officiellt från När då då.
      </p>
      <div className={styles.inlineLinks}>
        <Link href="/play">Välj tema och börja spela</Link>
        <Link href="/daily">Testa dagens spel</Link>
      </div>
    </section>
  );
}
