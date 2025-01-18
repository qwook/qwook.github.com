import "./panel.scss";

export function Panel({ children, ...props }) {
  return (
    <div {...props} className="panel">
      {children}
    </div>
  );
}
