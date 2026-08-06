import AppHead from "../components/app-head";
import HomeScreen from "../components/home-screen";
import {
  getHomeFaqStructuredData,
  HomeSeoContent,
} from "../components/seo-content";

export default function Index() {
  return (
    <>
      <AppHead
        canonicalPath="/"
        structuredData={[getHomeFaqStructuredData()]}
        title="VilketÅr – svenskt tidslinjespel | Gratis sällskapsspel"
      />
      <HomeScreen />
      <HomeSeoContent />
    </>
  );
}
