import * as _ from "lodash";
import { FlashCardDeck } from "./FlashCardDeck";
import Layout from "@/common/layout/Layout";

function Page() {
  return (
    <div>
      <h1>Weekdays</h1>
      <FlashCardDeck
        name=""
        list={[
          ["thứ hai", "Monday"],
          ["thứ ba", "Tuesday"],
          ["thứ tư", "Wednesday"],
          ["thứ năm", "Thursday"],
          ["thứ sáu", "Friday"],
          ["thứ bảy", "Saturday"],
          ["chủ nhật", "Sunday"],
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
