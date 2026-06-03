import AppHead from "../components/app-head";
import PageShell from "../components/page-shell";
import * as styles from "../styles/policy.css";

export default function IntegritetPage() {
  return (
    <>
      <AppHead
        canonicalPath="/integritet"
        description="Integritetspolicy för VilketÅr. Läs om hur vi hanterar dina personuppgifter enligt GDPR."
        title="Integritetspolicy | VilketÅr"
      />
      <PageShell>
        <div className={styles.screen}>
          <article className={styles.panel}>
            <h1 className={styles.title}>Integritetspolicy</h1>
            <p className={styles.subtitle}>Senast uppdaterad: 3 juni 2026</p>

            <p className={styles.text}>
              VilketÅr drivs av Wilgot Magnusson. Vi värnar om din integritet
              och är måna om att dina personuppgifter behandlas på ett säkert
              och lagligt sätt. Denna integritetspolicy förklarar hur vi samlar
              in, använder och skyddar din information när du spelar spelet och
              använder våra tjänster.
            </p>

            <h2 className={styles.sectionTitle}>
              1. Vilka uppgifter samlar vi in?
            </h2>
            <p className={styles.text}>
              Vi samlar endast in uppgifter som är nödvändiga för att spelet och
              dess funktioner (exempelvis Vänligor) ska fungera som avsett:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>E-postadress och inloggningsuppgifter:</strong> Om du
                väljer att spara ditt konto (konvertera från ett anonymt konto)
                samlar vi in din e-postadress och ett lösenord (vilket sparas
                krypterat hos vår infrastrukturleverantör Supabase).
              </li>
              <li className={styles.listItem}>
                <strong>Profiluppgifter:</strong> Det displaynamn du anger och
                eventuell profilbild du väljer att ladda upp för din profil i
                Vänligor.
              </li>
              <li className={styles.listItem}>
                <strong>Spelstatistik:</strong> Dina resultat i dagens spel samt
                dina poäng i de ligor du skapat eller gått med i.
              </li>
              <li className={styles.listItem}>
                <strong>Lokal lagring (LocalStorage):</strong> Vi sparar lokala
                inställningar på din enhet, såsom ditt val av tema (mörkt/ljust
                läge) och det nuvarande tillståndet för ditt pågående spel
                (spelsnapshot) för att du inte ska förlora dina framsteg om du
                stänger fliken.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>
              2. Varför och på vilken laglig grund behandlar vi uppgifterna?
            </h2>
            <p className={styles.text}>
              Vi behandlar dina personuppgifter med följande syften och lagliga
              grunder:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Fullgörande av avtal:</strong> Behandlingen av din
                e-post och profiluppgifter är nödvändig för att vi ska kunna
                erbjuda dig funktioner som kräver inloggning, synkronisering av
                ligor och resultat mellan dina enheter.
              </li>
              <li className={styles.listItem}>
                <strong>Berättigat intresse:</strong> Behandlingen av speldata
                och lokala inställningar görs för att tillhandahålla en bra
                spelupplevelse och upprätthålla spelets grundläggande
                funktioner.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>
              3. Hur länge sparar vi dina uppgifter?
            </h2>
            <p className={styles.text}>
              Dina personuppgifter sparas endast så länge som ditt konto är
              aktivt. Du kan när som helst ta bort ditt konto permanent. Detta
              gör du direkt i appen under fliken <strong>Konto</strong> (genom
              att välja "Ta bort konto"). Vid radering tas din e-postadress,
              inloggningsuppgifter, profilbild, displaynamn och alla dina
              ligaprestationer bort permanent från vår databas.
            </p>

            <h2 className={styles.sectionTitle}>
              4. Vilka delar vi informationen med?
            </h2>
            <p className={styles.text}>
              Dina uppgifter säljs eller delas aldrig med tredje part för
              marknadsföringsändamål. Vi använder Supabase som databas- och
              autentiseringsleverantör samt Cloudflare/Wrangler för hosting. De
              behandlar data för vår räkning och enligt våra instruktioner för
              att drifta webbplatsen.
            </p>

            <h2 className={styles.sectionTitle}>5. Dina rättigheter</h2>
            <p className={styles.text}>
              Enligt GDPR har du rätt till följande gällande dina uppgifter:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Rätt att begära ut ett utdrag av de personuppgifter vi har
                sparade om dig.
              </li>
              <li className={styles.listItem}>
                Rätt att kräva rättelse av felaktiga uppgifter.
              </li>
              <li className={styles.listItem}>
                Rätt att kräva radering av dina personuppgifter (vilket du även
                enkelt gör själv genom att radera ditt konto i appen).
              </li>
              <li className={styles.listItem}>
                Rätt att lämna klagomål till tillsynsmyndigheten
                (Integritetsskyddsmyndigheten - IMY) om du anser att vi
                behandlar dina personuppgifter i strid med GDPR.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>6. Kontakta oss</h2>
            <p className={styles.text}>
              Om du har frågor angående denna integritetspolicy eller vår
              behandling av dina personuppgifter är du välkommen att kontakta
              oss via e-post på:{" "}
              <a href="mailto:wilgot10@yahoo.com">wilgot10@yahoo.com</a>.
            </p>
          </article>
        </div>
      </PageShell>
    </>
  );
}
