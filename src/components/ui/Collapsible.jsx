import { useEffect, useRef, useState } from "react";
import "./collapsible.scss";

export function Collapsible({ name, children }) {
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (show) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [show]);

  return (
    <>
      <div className="collapsible-title" onClick={(e) => setShow(!show)}>
        <span className="chevron">
          {children ? show ? <>&#9660;</> : <>&#9658;</> : <>-</>}
        </span>
        {name}
      </div>
      <div
        style={{ height: height }}
        ref={contentRef}
        className={show ? "collapsible expanded" : "collapsible"}
      >
        {children}
      </div>
    </>
  );
}
