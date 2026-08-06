import AppHead from "../components/app-head";
import PartyScreen from "../components/party-screen";
import { PartySeoContent } from "../components/seo-content";

export default function PartyPage() {
  return (
    <>
      <AppHead
        canonicalPath="/party"
        description="Spela ett gratis sällskapsspel online: VilketÅr är ett svenskt tidslinjespel där ni placerar händelser, musik, sport och klassiker i rätt år."
        title="Sällskapsspel för hela familjen | VilketÅr"
      />
      <PartyScreen />
      <PartySeoContent />
    </>
  );
}
