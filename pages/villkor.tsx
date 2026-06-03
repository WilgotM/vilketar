import AppHead from "../components/app-head";
import PageShell from "../components/page-shell";
import * as styles from "../styles/policy.css";

export default function VillkorPage() {
  return (
    <>
      <AppHead
        canonicalPath="/villkor"
        description="Användarvillkor för VilketÅr. Läs om regler för användande, uppförande och vår ansvarsfriskrivning för faktafel."
        title="Användarvillkor | VilketÅr"
      />
      <PageShell>
        <div className={styles.screen}>
          <article className={styles.panel}>
            <h1 className={styles.title}>Användarvillkor</h1>
            <p className={styles.subtitle}>Senast uppdaterad: 3 juni 2026</p>

            <p className={styles.text}>
              Välkommen till VilketÅr! Dessa användarvillkor reglerar din
              användning av vår webbplats och de spel samt tjänster vi erbjuder.
              Genom att spela spelet, skapa ett konto eller på annat sätt
              använda webbplatsen godkänner du dessa villkor i sin helhet.
            </p>

            <h2 className={styles.sectionTitle}>1. Om tjänsten</h2>
            <p className={styles.text}>
              VilketÅr är ett svenskt, kostnadsfritt tidslinjespel. Spelet drivs
              som ett privat hobbyprojekt av Wilgot Magnusson och tillhandahålls
              i underhållningssyfte.
            </p>

            <h2 className={styles.sectionTitle}>
              2. Ansvarsfriskrivning gällande fakta och årtal
            </h2>
            <p className={styles.text}>
              Historisk fakta, årtal, bilder och texter i spelet hämtas till
              stor del automatiskt från Wikidata och svenska Wikipedia.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Spelet tillhandahålls i <strong>befintligt skick</strong> ("as
                is") och utan några garantier.
              </li>
              <li className={styles.listItem}>
                Vi kan inte garantera att alla uppgifter, årtal eller påståenden
                i spelet är korrekta, fullständiga eller uppdaterade.
              </li>
              <li className={styles.listItem}>
                Vi frånsäger oss allt ansvar för eventuella direkta eller
                indirekta förluster, tvister eller skador som kan uppstå till
                följd av felaktig information i spelet (exempelvis om spelet
                används i tävlingar eller quiz- sammanhang där resultat
                ifrågasätts).
              </li>
              <li className={styles.listItem}>
                Fel i fakta och årtal rättas bäst direkt vid källan på Wikidata.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>
              3. Användarkonton och uppförande
            </h2>
            <p className={styles.text}>
              När du deltar i "Vänligor" har du möjlighet att skapa en profil
              med ett displaynamn och en profilbild. För att hålla spelet
              trevligt och säkert gäller följande regler:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Det är strängt förbjudet att använda displaynamn eller ladda upp
                profilbilder som är stötande, kränkande, olagliga eller på annat
                sätt olämpliga.
              </li>
              <li className={styles.listItem}>
                Det är inte tillåtet att störa spelets funktionalitet,
                manipulera poäng eller på annat sätt missbruka våra databaser
                och API:er (t.ex. genom botar, skript eller
                överbelastningsattacker).
              </li>
              <li className={styles.listItem}>
                Vi förbehåller oss rätten att utan förvarning radera profiler,
                ligor eller stänga av användare som bryter mot dessa regler
                eller på annat sätt missbrukar tjänsten.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>
              4. Immaterialrätt och licenser
            </h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Kodbas:</strong> Källkoden till spelet bygger på öppen
                källkod från Wikitrivia och distribueras i enlighet med
                MIT-licensen.
              </li>
              <li className={styles.listItem}>
                <strong>Innehåll (trivia och texter):</strong> Trivia hämtas
                från Wikidata (licensierat under Creative Commons CC0 / Public
                Domain) och svenska Wikipedia (licensierat under Creative
                Commons Attribution-ShareAlike / CC BY-SA).
              </li>
              <li className={styles.listItem}>
                <strong>Bilder:</strong> Bildmaterial som visas på korten bäddas
                in live från Wikimedia Commons och ägs av sina respektive
                upphovsmän under de licenser som anges på Wikimedia Commons.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>5. Ändringar av villkoren</h2>
            <p className={styles.text}>
              Vi kan komma att ändra och uppdatera dessa användarvillkor över
              tid. Den senaste versionen finns alltid publicerad på denna sida.
              Genom att fortsätta använda webbplatsen efter att ändringar gjorts
              godkänner du de uppdaterade villkoren.
            </p>

            <h2 className={styles.sectionTitle}>6. Kontakt</h2>
            <p className={styles.text}>
              Om du har några frågor eller synpunkter gällande användarvillkoren
              eller tjänsten är du välkommen att kontakta oss via e-post på:{" "}
              <a href="mailto:wilgot10@yahoo.com">wilgot10@yahoo.com</a>.
            </p>
          </article>
        </div>
      </PageShell>
    </>
  );
}
