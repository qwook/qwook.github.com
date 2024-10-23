import { createPage } from "../app";
import { useEffect, useMemo, useRef, useState } from "react";

function Image({ url, x, y, w, h, offsetX, offsetY, scaleX }) {
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

  const ref = useRef();

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width: size.w,
        height: size.h,
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
            width: size.w - 6,
            height: size.h - 6,
            border: "3px inset grey",
            background: `url("${require("./images/decompose/broken-image.png")}") no-repeat 5px 5px`,
            userSelect: "none",
          }}
        ></div>
        <img
          src={url}
          draggable="false"
          style={{
            position: "absolute",
            background: "white",
            left: offset.x,
            top: offset.y,
            width: scale,
            opacity: error ? 0 : editing ? 0.6 : 1,
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

export default function DecomposePage() {
  return (
    <div className="decompose">
      <h1>part 1</h1>
      <p>
        i've woken up early in the morning, yet again, in a cold sweat, to
        create another web site.
      </p>
      <p>
        right now it's october 22, 2024. i am moving away from san francisco. in
        40 days, that part of my soul dies, and every potential version of my
        life that would have existed if i stayed will also die.
      </p>
      <p>
        i am thinking about the ephemerality of everything. the internet was a
        promise of something beyond the physical, but{" "}
        <a href="https://lastseenonline.com" target="_blank">
          even the internet deteriorates.
        </a>
      </p>
      <p>
        none of the images on the page are hosted by me. over time, these images
        will go offline.
      </p>
      <p>
        the grass will die, the flowers will wither, and the body of the
        internet will decompose, until all that remains is #FFFFFF.
      </p>
      <p>it may take years until all of this is fully realized.</p>
      <p>
        <strong>STATUS: </strong> the body is in gestation period
      </p>
      <div
        style={{
          position: "relative",
          width: "800px",
          height: "1300px",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <Image
          url="https://img.freepik.com/premium-photo/arafed-image-man-with-glowing-body-arms-generative-ai_958165-10874.jpg"
          x={0}
          y={0}
          w={800}
          h={1300}
          offsetX={-600}
          offsetY={-400}
          scaleX={2000}
        />
        <Image
          url="https://asset.bloomnation.com/c_limit,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1672393385/vendor/5829/catalog/product/2/0/20170116102957_file_587d4965643c9_447.jpg"
          x={72}
          y={763}
          w={167}
          h={163}
          offsetX={-16.5}
          offsetY={-17.5}
          scaleX={209}
        />
        <Image
          url="https://geocities.restorativland.org/Tokyo/2310/ac2.jpg"
          x={307}
          y={294}
          w={201}
          h={98}
          offsetX={-93}
          offsetY={-293}
          scaleX={576}
        />
        <Image
          url="https://yt3.googleusercontent.com/4mouQBt86vo5z8MOQtQlTjzUbRatyFJuEX5AP1U85YPJgS3SCpW9Tge6maiuToHxc0g9pDlrc-0=w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"
          x={228}
          y={257}
          w={112}
          h={144}
          offsetX={-772}
          offsetY={-185}
          scaleX={2102}
        />
        <Image
          url="https://uploads.gamedev.net/profiles/monthly_2023_07/medium.9c6da3566dde42cebc32abc187ff969b.Matt-Square.png"
          x={406}
          y={71}
          w={112}
          h={155}
          offsetX={-130.5}
          offsetY={-40.5}
          scaleX={265}
        />
        <Image
          url="https://designyoutrust.com/wp-content/uploads/2021/06/93807914_187882152169210_2285577750806832486_n.jpg"
          x={503}
          y={292}
          w={120}
          h={301}
          offsetX={-598.5}
          offsetY={-140.5}
          scaleX={961}
        />
        <Image
          url="https://www.eresparis.com/dw/image/v2/BDLN_PRD/on/demandware.static/-/Sites-master/default/dw56a4cdcf/images/032426_1001_PDP_D_2.jpg?sw=1950&sh=1300&frz-v=270"
          x={317}
          y={212}
          w={149}
          h={98}
          offsetX={-525}
          offsetY={-161}
          scaleX={1216}
        />
        <Image
          url="https://www.agulloplasticsurgery.com/wp-content/themes/pss-theme/_dist/img/img-services-models.png"
          x={583}
          y={586}
          w={60}
          h={140}
          offsetX={-720}
          offsetY={-610}
          scaleX={845}
        />
        <Image
          url="https://pix-ht.trafficjunky.net/c3721/uploaded_content/creative/102/748/797/1/1027487971.png/plain/autoquality:dssim:0.004::100:0.001?validfrom=1729043688&validto=1730253288&hash=NeycyQU0MzvUR52Fdb2xZFGDfO0%3D"
          x={456}
          y={251}
          w={92}
          h={128}
          offsetX={-240.5}
          offsetY={-126.5}
          scaleX={381}
        />
        <Image
          url="https://philipbrasor.com/wp-content/uploads/2013/05/3sisters.jpg"
          x={315}
          y={77}
          w={98}
          h={135}
          offsetX={-589.5}
          offsetY={-311.5}
          scaleX={1663}
        />
        <Image
          url="https://cdn2.stylecraze.com/wp-content/uploads/2015/03/79-Top-10-Celebrities-With-Sexy-Eyebrows.jpg.avif"
          x={387}
          y={143}
          w={42}
          h={69}
          offsetX={-188.5}
          offsetY={-170.5}
          scaleX={405}
        />
        <Image
          url="https://img.youtube.com/vi/SoYxYbSPACQ/hqdefault.jpg"
          x={407}
          y={150}
          w={56}
          h={29}
          offsetX={-552}
          offsetY={-425}
          scaleX={1362}
        />

        <Image
          url="https://pbs.twimg.com/media/FulsrogWIAMMqbv?format=jpg&name=large"
          x={376}
          y={207}
          w={59}
          h={40}
          offsetX={-485}
          offsetY={-706}
          scaleX={636}
        />
        <Image
          url="https://d2w9rnfcy7mm78.cloudfront.net/5969153/original_65361e17f88edeff00132155acf90383.jpg?1579716304?bc=0"
          x={348}
          y={151}
          w={57}
          h={36}
          offsetX={-116.5}
          offsetY={-116.5}
          scaleX={329}
        />
        <Image
          url="https://d2w9rnfcy7mm78.cloudfront.net/5969153/original_65361e17f88edeff00132155acf90383.jpg?1579716304?bc=0"
          x={348}
          y={151}
          w={57}
          h={36}
          offsetX={-116.5}
          offsetY={-116.5}
          scaleX={329}
        />
        <Image
          url="https://images.squarespace-cdn.com/content/v1/548c8636e4b0a269c59621f1/1573527149389-CXBWTYCQAZY1UIKRCVFZ/size-chart-update.jpg?format=1500w"
          x={142}
          y={599}
          w={67}
          h={131}
          offsetX={-193}
          offsetY={-759}
          scaleX={2102}
        />
        <Image
          url="https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-15/374878701_285059084233795_8291048117684014328_n.jpg?stp=dst-jpg_e15&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDI1NjAuc2RyLmYzNjMyOS5kZWZhdWx0X2NvdmVyX2ZyYW1lIn0&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=107&_nc_ohc=SGEQrQqCx0EQ7kNvgEzooiV&_nc_gid=25412358d3f14c898be17182ef56df7e&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzE4NTI2MTkwOTQxMDYyNjk2OA%3D%3D.3-ccb7-5&oh=00_AYD7d9Dp0UReK8eNXrUBFwTWg_ZVuO4b9Kk_UsCQ5BMt6g&oe=671E160A&_nc_sid=7a9f4b"
          x={171}
          y={400}
          w={120}
          h={205}
          offsetX={-172}
          offsetY={-745}
          scaleX={2102}
        />
        <Image
          url="https://cdn.donaldjtrump.com/djtweb24/general/DJT_banner.jpg"
          x={286}
          y={364}
          w={111}
          h={92}
          offsetX={-1181.5}
          offsetY={-405.5}
          scaleX={1763}
        />
        <Image
          url="https://kamalaharris.com/wp-content/uploads/2024/09/COMP-Vice-President-Kamala-Harris-introduces-6k-Lightbox-img.jpg"
          x={394}
          y={365}
          w={109}
          h={92}
          offsetX={-701.5}
          offsetY={-481.5}
          scaleX={1763}
        />
        <Image
          url="https://img.ssensemedia.com/images/h_1428,w_952,c_limit,f_auto/242281F073012_1/agent-provocateur-black-and-pink-lorna-plunge-underwired-bra.jpg"
          x={301}
          y={448}
          w={202}
          h={151}
          offsetX={-76}
          offsetY={-398}
          scaleX={346}
        />
        <Image
          url="https://images.squarespace-cdn.com/content/v1/5f6918424a397c549c1e62da/3788ef3e-13bb-4f34-b0ff-141e2172bbf1/LSY_Workshop+Main+Image+%287%29.jpg"
          x={308}
          y={448}
          w={196}
          h={74}
          offsetX={-829}
          offsetY={-555}
          scaleX={1208}
        />
        <Image
          url="https://images.craigslist.org/00808_2sDDmn7lAm7_0ne0t2_1200x900.jpg"
          x={231}
          y={326}
          w={77}
          h={132}
          offsetX={-38}
          offsetY={-235}
          scaleX={418}
        />
        {/* https://images.craigslist.org/00808_2sDDmn7lAm7_0ne0t2_1200x900.jpg */}
      </div>
      <h1>part 2</h1>
      <p>
        it is now 2:05 PM, i have talked to another human and went on a
        motorcycle ride.
      </p>
      <p>it is the gestational period of the body</p>
      <p>
        what if a body never dies but goes through stages of metamorphosis? from
        this, something new, beyond our understanding, beyond anthromorphism,
        something made of pure #FFFFFF arises.
      </p>
    </div>
  );
}

createPage(DecomposePage, { showPets: false });
