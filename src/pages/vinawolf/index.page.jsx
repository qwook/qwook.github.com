import Banner from "@/common/components/Banner";

import { VinaWolf } from "./VinaWolf";
import Layout from "@/common/layout/Layout";

function VinaWolfPage() {
  return (
    <>
      <Banner>VinaWolf</Banner>
      <VinaWolf />
    </>
  );
}

export default function Root() {
  return (
    <Layout>
      <VinaWolfPage />
    </Layout>
  );
}
