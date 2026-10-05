import * as _ from "lodash";
import { FlashCardDeck } from "../FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Doraemon appears with a warning.</h1>
      <FlashCardDeck
        name=""
        list={[
          ["tránh", "avoid"],
          ["rủi ro xui xẻo", "risk / bad luck"],
          ["vộ lý", "absurd"],
          ["mạnh giỏi", "healthy"],
          ["thầy bói", "fortune teller"],
          ["rất tiếc", "sorry"],
          ["vọng năm nay", "hope this year"],
          ["tai nạn suýt chết", "near-fatal accident"],
          ["nếm", "taste"],
          ["ngon quá xá là", "so delicious"],
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
