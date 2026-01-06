import { useState } from "react";

export function TdWithPreview({ children, preview }) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <td
      className="project"
      onClick={(e) => {
        setShowPreview((showPreview) => !showPreview);
        e.preventDefault();
      }}
    >
      <span className="name">{children}</span>
      {showPreview && preview && (
        <>
          <br />
          <div className="description">{preview}</div>
        </>
      )}
    </td>
  );
}
