import Page from "./components/page";
import React from "react";
import ReactDOM from 'react-dom/client';

export function createPage(content) {
  function App({ children }) {
    return <Page>{content}</Page>
  }

  // Render the React component into the DOM
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}