import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

export function CodeWithFrame({ src }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="code-with-frames">
      <h4>Preview</h4>
      <iframe srcdoc={src}></iframe>
      <h4
        className="fake-link"
        onClick={(e) => {
          setVisible((visible) => !visible);
        }}
      >
        {"> "}Show Code
      </h4>
      {visible && <SyntaxHighlighter language="html">{src}</SyntaxHighlighter>}
    </div>
  );
}
