import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Descriptor Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["sến", "cheesy (actually might not be usable for humans)"],
          ["lười (biếng)", "lazy"],
          ["ngại (ngùng)", "shy"],
          ["tốt", "kind"],
          ["thân thiện", "friendly"],
          ["xấu", "bad"],
        ]}
      />
    </div>
  );
}

export default function Root() {
  return (
    <Layout>
      <Page />
    </Layout>
  );
}
