import { useState } from "react";

export function TdWithPreview({ children, preview }) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <td className="project">
      <div
        className="top-name-dude"
        onClick={(e) => {
          setShowPreview((showPreview) => !showPreview);
          e.preventDefault();
        }}
      >
        <span className="name">{children}</span>
      </div>
      {showPreview && preview && (
        <>
          <div className="description">{preview}</div>
        </>
      )}
    </td>
  );
}
