import Banner from "../components/Banner";
import { createPage } from "../app";
import { Smiley } from "../components/smiley/Smiley";

import "./smiley.scss"

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

createPage(SmileyPage);
