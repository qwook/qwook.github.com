import SyntaxHighlighter from "react-syntax-highlighter";

export function CodeWithFrame({ src }) {
  return (
    <div className="code-with-frames">
      <h4>Code</h4>
      <SyntaxHighlighter language="html">{src}</SyntaxHighlighter>
      <h4>Preview</h4>
      <iframe srcdoc={src}></iframe>
    </div>
  );
}
