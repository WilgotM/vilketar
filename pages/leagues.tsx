import AppHead from "../components/app-head";
import LeaguesScreen from "../components/leagues-screen";

export default function LeaguesPage() {
  return (
    <>
      <AppHead
        canonicalPath="/leagues"
        description="Skapa en vänliga i VilketÅr och jämför dagens resultat med familj och vänner."
        title="Vänligor | VilketÅr"
      />
      <LeaguesScreen />
    </>
  );
}
