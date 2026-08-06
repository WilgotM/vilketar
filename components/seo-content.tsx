import Link from "next/link";
import * as styles from "../styles/seo-content.css";

const faqItems = [
  {
    answer:
      "VilketÅr är ett gratis svenskt tidslinjespel. Du får ett kort med en händelse, person, låt eller klassiker och placerar det där du tror att det hör hemma på tidslinjen.",
    question: "Vad är VilketÅr?",
  },
  {
    answer:
      "Ja. Välj Sällskapsspel för att spela tillsammans med två eller fler lag på samma skärm. Det fungerar bra hemma, på fest och på en TV.",
    question: "Kan man spela VilketÅr som sällskapsspel?",
  },
  {
    answer:
      "När då då? är ett annat tidsbaserat sällskapsspel. VilketÅr är ett fristående spel med egna kort, svenska teman och ett gratis webbläge.",
    question: "Är VilketÅr samma spel som När då då?",
  },
];

export function getHomeFaqStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}

export function HomeSeoContent() {
  return (
    <section
      aria-labelledby="home-seo-title"
      className={styles.section}
      id="om-vilketar"
    >
      <div className={styles.eyebrow}>Ett svenskt tidslinjespel</div>
      <h2 className={styles.title} id="home-seo-title">
        Vad är VilketÅr?
      </h2>
      <p className={styles.copy}>
        VilketÅr är ett gratis svenskt tidslinjespel för dig som gillar
        historia, musik, sport och svenska klassiker. Gissa när något hände och
        placera kortet på rätt plats i tidslinjen – ensam, med familjen eller
        som ett sällskapsspel med flera lag.
      </p>
      <div className={styles.linkGrid}>
        <Link className={styles.linkCard} href="/daily">
          <strong>Dagens spel</strong>
          <span className={styles.linkCardText}>
            En ny tidslinjeutmaning varje dag.
          </span>
        </Link>
        <Link className={styles.linkCard} href="/party">
          <strong>Sällskapsspel</strong>
          <span className={styles.linkCardText}>
            Spela tillsammans på mobil, dator eller TV.
          </span>
        </Link>
        <Link className={styles.linkCard} href="/play">
          <strong>Fritt spel</strong>
          <span className={styles.linkCardText}>
            Välj själv mellan svenska teman och kategorier.
          </span>
        </Link>
      </div>
      <div className={styles.faq}>
        <h2 className={styles.subtitle}>Vanliga frågor</h2>
        {faqItems.map((item) => (
          <details className={styles.faqItem} key={item.question}>
            <summary className={styles.faqSummary}>{item.question}</summary>
            <p className={styles.faqAnswer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

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
