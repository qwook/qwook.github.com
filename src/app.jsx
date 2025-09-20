import Page from "./components/Page";
import ReactDOM from "react-dom/client";

export function createPage(App, options = {}) {
  const render = () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <Page {...options}>
        <App />
      </Page>
    );
  };

  // Render the React component into the DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
}
