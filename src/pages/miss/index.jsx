import { createPage } from "../../app";
import * as _ from "lodash";
import { useEffect } from "react";

export default function Page() {
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

createPage(Page, { showPets: false, showNav: false });
