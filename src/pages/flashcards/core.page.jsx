import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Core Words</h1>
      <FlashCardDeck
        name=""
        list={[
          ["đến", "to / arrive at"],
          ["điều", "things"],
          ["rằng", "formal là"],
          ["vẫn", "still"],
          ["vào", "enter, incoming, on"],
          ["như", "like so"],
          ["cố gắng", "try"],
          ["vạy", "so, the reason, right? (used at the end.)"],
          ["thay vào đó", "instead / replace that with"],
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
