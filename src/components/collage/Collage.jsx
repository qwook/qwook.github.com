import { createContext, useContext, useEffect, useRef, useState } from "react";

export const CollageContext = createContext({
  fullWidth: 0,
  fullHeight: 0,
  refWidth: 1,
  refHeight: 1,
  hoverToDecompose: false,
});

export function CollageImage({ url, x, y, w, h, offsetX, offsetY, scaleX }) {
  const { fullWidth, fullHeight, refWidth, refHeight, hoverToDecompose } =
    useContext(CollageContext);

  const oldToFullWidth = fullWidth / refWidth;
  const oldToFullHeight = fullHeight / refHeight;

  const [pos, setPos] = useState({ x, y });
  const [size, setSize] = useState({ w, h });
  const [offset, setOffset] = useState({ x: offsetX, y: offsetY });
  const [scale, setScale] = useState(scaleX);

  useEffect(() => {
    setPos({ x, y });
  }, [x, y]);

  useEffect(() => {
    setSize({ w, h });
  }, [w, h]);

  useEffect(() => {
    setOffset({ x: offsetX, y: offsetY });
  }, [offsetX, offsetY]);

  useEffect(() => {
    setScale(scaleX);
  }, [scaleX]);

  // For mouse stuff.
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);
  const initialPos = useRef({ x: 0, y: 0 });
  const initialClientPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ w: 0, h: 0 });
  const initialOffset = useRef({ x: 0, y: 0 });
  const initialScale = useRef(0);

  const borderThreshold = 10;

  const resizeLeft = useRef(false);
  const resizeRight = useRef(false);
  const resizeUp = useRef(false);
  const resizeDown = useRef(false);
  const shiftKey = useRef(false);
  const altKey = useRef(false);

  const [cursor, setCursor] = useState("move");

  const log = useRef();
  log.current = () => {
    console.log(`
    x={${pos.x}}
    y={${pos.y}}
    w={${size.w}}
    h={${size.h}}
    offsetX={${offset.x}}
    offsetY={${offset.y}}
    scaleX={${scale}}
    `);
  };

  useEffect(() => {
    if (editing) {
      const mouseUp = (e) => {
        clearTimeout(hoverTimeout);
        setHover(false);
        setEditing(false);
        log.current();
      };
      document.body.addEventListener("mouseup", mouseUp);

      const mouseMove = (e) => {
        const delta = {
          x: e.clientX - initialClientPos.current.x,
          y: e.clientY - initialClientPos.current.y,
        };
        if (shiftKey.current) {
          setOffset({
            x: initialOffset.current.x + delta.x,
            y: initialOffset.current.y + delta.y,
          });
        } else if (altKey.current) {
          setOffset((offset) => {
            console.log(offset);
            return {
              x: initialOffset.current.x - delta.x / 2,
              y: initialOffset.current.y - delta.x / 2,
            };
          });
          setScale(initialScale.current + delta.x);
        } else {
          setPos({
            x: initialPos.current.x + (resizeLeft.current ? delta.x : 0),
            y: initialPos.current.y + (resizeUp.current ? delta.y : 0),
          });
          setSize({
            w:
              initialSize.current.w +
              (resizeLeft.current
                ? -delta.x
                : resizeRight.current
                ? delta.x
                : 0),
            h:
              initialSize.current.h +
              (resizeUp.current ? -delta.y : resizeDown.current ? delta.y : 0),
          });
          setOffset({
            x: initialOffset.current.x - (resizeLeft.current ? delta.x : 0),
            y: initialOffset.current.y - (resizeUp.current ? delta.y : 0),
          });
          if (
            !resizeLeft.current &&
            !resizeRight.current &&
            !resizeUp.current &&
            !resizeDown.current
          )
            setPos({
              x: initialPos.current.x + delta.x,
              y: initialPos.current.y + delta.y,
            });
        }
      };
      document.body.addEventListener("mousemove", mouseMove);

      return () => {
        document.body.removeEventListener("mouseup", mouseUp);
        document.body.removeEventListener("mousemove", mouseMove);
      };
    }
  }, [editing]);

  const hoverTimeout = useRef();

  const ref = useRef();

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: pos.y * oldToFullHeight,
        left: pos.x * oldToFullWidth,
        width: size.w * oldToFullWidth,
        height: size.h * oldToFullHeight,
        cursor: cursor,
        overflow: "hidden",
        userSelect: "none",
      }}
      onMouseMove={(e) => {
        const rect = ref.current.getBoundingClientRect(); // Get the bounding rectangle of the element
        const relMouseX = e.clientX - rect.left; // Calculate x relative to the element
        const relMouseY = e.clientY - rect.top; // Calculate y relative to the element

        const resizeLeft = relMouseX <= borderThreshold;
        const resizeRight = relMouseX >= rect.width - borderThreshold;
        const resizeUp = relMouseY <= borderThreshold;
        const resizeDown = relMouseY >= rect.height - borderThreshold;

        // Update the cursor based on which sides are active for resizing
        if (resizeLeft && resizeUp) {
          setCursor("nw-resize");
        } else if (resizeRight && resizeUp) {
          setCursor("ne-resize");
        } else if (resizeLeft && resizeDown) {
          setCursor("sw-resize");
        } else if (resizeRight && resizeDown) {
          setCursor("se-resize");
        } else if (resizeLeft) {
          setCursor("w-resize");
        } else if (resizeRight) {
          setCursor("e-resize");
        } else if (resizeUp) {
          setCursor("n-resize");
        } else if (resizeDown) {
          setCursor("s-resize");
        } else {
          setCursor("move");
        }

        setHover(true);
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = setTimeout(() => {
          setHover(false);
        }, 1000);
      }}
      onTouchStart={(e) => {
        setHover(true);
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = setTimeout(() => {
          setHover(false);
        }, 1000);
      }}
      onMouseDown={(e) => {
        const rect = ref.current.getBoundingClientRect(); // Get the bounding rectangle of the element
        const relMouseX = e.clientX - rect.left; // Calculate x relative to the element
        const relMouseY = e.clientY - rect.top; // Calculate y relative to the element

        initialPos.current = { x: pos.x, y: pos.y };
        initialSize.current = { w: size.w, h: size.h };
        initialClientPos.current = { x: e.clientX, y: e.clientY };
        initialOffset.current = { x: offset.x, y: offset.y };
        initialScale.current = scale;

        resizeLeft.current = relMouseX <= borderThreshold;
        resizeRight.current = relMouseX >= rect.width - borderThreshold;
        resizeUp.current = relMouseY <= borderThreshold;
        resizeDown.current = relMouseY >= rect.height - borderThreshold;

        shiftKey.current = e.shiftKey;
        altKey.current = e.metaKey;

        setEditing(true);
      }}
    >
      <div style={{ position: "relative", userSelect: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size.w * oldToFullWidth - 6,
            height: size.h * oldToFullHeight - 6,
            border: "3px inset grey",
            background: `url("${require("./images/broken-image.png")}") no-repeat 5px 5px`,
            userSelect: "none",
          }}
        ></div>
        <img
          src={url}
          draggable="false"
          style={{
            position: "absolute",
            background: "white",
            left: offset.x * oldToFullWidth,
            top: offset.y * oldToFullHeight,
            width: scale * oldToFullWidth,
            opacity: hoverToDecompose
              ? editing
                ? 0.6
                : hover
                ? 0
                : error
                ? 0
                : 1
              : 1,
            userSelect: "none",
          }}
          onError={(e) => {
            setError(true);
          }}
        />
      </div>
    </div>
  );
}

export function Collage({ sizeRatio, context={}, children }) {
  const bodyContainerRef = useRef();
  const [size, setSize] = useState({ width: 800, height: 1300 });

  // Start observing the element when the component is mounted
  useEffect(() => {
    const element = bodyContainerRef?.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      const newWidth = element.getBoundingClientRect().width;
      setSize({ width: newWidth, height: newWidth * sizeRatio });
      console.log("hey");
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <CollageContext.Provider
      value={{
        fullWidth: size.width,
        fullHeight: size.height,
        refWidth: 1,
        refHeight: 1,
        ...context,
      }}
    >
      <div
        ref={bodyContainerRef}
        style={{
          position: "relative",
          width: "100%",
          height: size.height,
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {children}
      </div>
    </CollageContext.Provider>
  );
}
