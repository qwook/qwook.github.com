import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Flavor Text</h1>
      <FlashCardDeck
        name=""
        list={[
          ["quả là", "indeed"],
          ["thật", "really / truly (northern)"],
          ["thiệt", "really / truly (southern)"],
          ["nhỉ", "right? (added at end)"],
          ["cực kỳ", "extremely"],
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
