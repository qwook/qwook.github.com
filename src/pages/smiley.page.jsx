import _ from "lodash";
import Banner from "@/common/components/Banner";

import { Smiley } from "@/common/components/smiley/Smiley";

import "./smiley.css"
import Layout from "@/common/layout/Layout";

function SmileyPage() {
  return (
    <>
      <Banner>Smiley List</Banner>
      <p>wth are you doing here?? this is mostly for meee</p>
      {_.range(1, 114).map((i) => (
        <div className="smiley-selector" onClick={(e) => {
          navigator.clipboard.writeText(`<Smiley id={${i}} />`);
        }}>
          <Smiley id={i} />
        </div>
      ))}
    </>
  );
}

export default function Root() {
  return (
    <Layout>
      <SmileyPage />
    </Layout>
  );
}
