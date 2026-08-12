import AppHead from "../components/app-head";
import HomeScreen from "../components/home-screen";

export default function Index() {
  return (
    <>
      <AppHead
        canonicalPath="/"
        title="VilketÅr – svenskt tidslinjespel | Gratis sällskapsspel"
      />
      <HomeScreen />
    </>
  );
}
