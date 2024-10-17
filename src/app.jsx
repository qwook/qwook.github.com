import Page from "./components/Page";
import React from "react";
import ReactDOM from "react-dom/client";

export function createPage(App, options = {}) {
  // Render the React component into the DOM
  document.addEventListener("DOMContentLoaded", () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <Page {...options}>
        <App />
      </Page>
    );
  });
}
