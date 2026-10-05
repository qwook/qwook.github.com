import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Math and Address Symbols</h1>
      <FlashCardDeck
        name=""
        list={[
          ["phần", "divide"],
          ["bằng", "equals"],
          ["nhân", "multiply"],
          ["trừ", "minus"],
          ["cộng", "plus"],
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
