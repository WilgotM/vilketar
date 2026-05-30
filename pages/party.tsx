import AppHead from "../components/app-head";
import PartyScreen from "../components/party-screen";

export default function PartyPage() {
  return (
    <>
      <AppHead
        canonicalPath="/party"
        description="Starta VilketÅr som sällskapsspel och turas om att placera välkända händelser i rätt år."
        title="Sällskapsspel | VilketÅr"
      />
      <PartyScreen />
    </>
  );
}
