import Banner from "../components/Banner";
import Page from "../components/Page";
import { createPage } from "../app";
import { VinaWolf } from "../components/vinawolf/VinaWolf";

export default function VinaWolfPage() {
  return (
    <>
      <Banner>VinaWolf</Banner>
      <VinaWolf />
    </>
  );
}

createPage(VinaWolfPage, { showPets: false });
