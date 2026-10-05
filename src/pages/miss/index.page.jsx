import * as _ from "lodash";
import { useEffect } from "react";
import Layout from "@/common/layout/Layout";

function Page() {
  useEffect(() => {
    window.location.href = "https://qwook.itch.io/and-youll-miss-it";
  }, []);

  return (
    <div>
      Redirecting you...{" "}
      <a href="https://qwook.itch.io/and-youll-miss-it">Click here</a> if you're
      stuck.
    </div>
  );
}

export default function Root() {
  return (
    <Layout showNav={false}>
      <Page />
    </Layout>
  );
}
