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

        setHover(true);
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = setTimeout(() => {
          setHover(false);
        }, 1000);
      }}
      onTouchMove={(e) => {
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
            opacity: editing ? 0.6 : hover ? 0 : error ? 0 : 1,
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
          url="https://www.customhomegroup.com/wp-content/uploads/2017/10/how-to-prune-your-garden-1179x450.jpg"
          x={-5}
          y={-19}
          w={517}
          h={389}
          offsetX={-775.5}
          offsetY={-308.5}
          scaleX={1889}
        />
        <Image
          url="https://wcdn-universe.flyff.com/site/landing/images/new/slider07.jpg"
          x={321}
          y={-7}
          w={477}
          h={522}
          offsetX={-1668}
          offsetY={-708}
          scaleX={2482}
        />
        <Image
          url="https://images.squarespace-cdn.com/content/v1/54a4792ae4b0ac4256d985e4/1630230753500-NVKQSCLPU4QGUR3959QO/20210804201908_1.jpg?format=2500w"
          x={-8}
          y={368}
          w={462}
          h={602}
          offsetX={-1668}
          offsetY={-441}
          scaleX={2482}
        />
        <Image
          url="https://myphillypark.org/app/uploads/2021/09/Mows-to-Meadows-Map-small-jpg-scaled.jpg"
          x={352}
          y={502}
          w={458}
          h={548}
          offsetX={-3037.5}
          offsetY={-1546.5}
          scaleX={4337}
        />
        <Image
          url="https://www.alltrails.com/_next/image?url=https%3A%2F%2Fimages.alltrails.com%2FeyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvMzY5OTcyNTUvNDZjZDVjNWE2Y2QwYzVmMTI0NThiNGM5YmQ1NWRmMTQuanBnIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoxMDgwLCJoZWlnaHQiOjcwMCwiZml0IjoiY292ZXIifSwicm90YXRlIjpudWxsLCJqcGVnIjp7InRyZWxsaXNRdWFudGlzYXRpb24iOnRydWUsIm92ZXJzaG9vdERlcmluZ2luZyI6dHJ1ZSwib3B0aW1pc2VTY2FucyI6dHJ1ZSwicXVhbnRpc2F0aW9uVGFibGUiOjN9fX0%3D&w=640&q=90"
          x={-8}
          y={955}
          w={597}
          h={548}
          offsetX={-2659}
          offsetY={-1625}
          scaleX={3776}
        />
        <Image
          url="https://www.harvard.edu/wp-content/uploads/2024/10/081022_Harvard_Forest_08.jpg?w=768&h=576&crop=1"
          x={531}
          y={1037}
          w={452}
          h={516}
          offsetX={-2070}
          offsetY={-1207}
          scaleX={2376}
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
          url="https://s-img.mgid.com/g/18564168/1020x574/-/aHR0cDovL2NsLmltZ2hvc3RzLmNvbS9pbWdoL2ltYWdlL2ZldGNoL2FyXzE2OjksY19maWxsLGVfc2hhcnBlbjoxMDAsZl9qcGcsZ19mYWNlczphdXRvLHFfYXV0bzpnb29kLHdfMTAyMC9odHRwOi8vaW1naG9zdHMuY29tL3QvMjAyNC0wMi8xMTU1MjkvNDRmMjg0Y2YyMGIyZDg0MjZmY2E4MWFlOTcxMjJlZjQucG5n.webp?v=1729673937-1YI1L6NhnkK0FOL9neSBBBZTw8mHh3h9kRRyvkv_6wo"
          x={346}
          y={208}
          w={110}
          h={50}
          offsetX={-93}
          offsetY={-100}
          scaleX={282}
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
          url="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/ss_537683e5e29c2d6d02c64aa7321dcb26166f7d82.600x338.jpg?t=1727975092"
          x={164}
          y={437}
          w={104}
          h={161}
          offsetX={-1481.5}
          offsetY={-1485.5}
          scaleX={4359}
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
        <Image
          url="https://assetsio.gnwcdn.com/jedi-survivor-data-lancamento.jfif?width=690&quality=75&format=jpg&dpr=2&auto=webp"
          x={266}
          y={589}
          w={138}
          h={251}
          offsetX={-1054}
          offsetY={-526}
          scaleX={1814}
        />
        <Image
          url="https://play-lh.googleusercontent.com/10dkvGK-B92ENb5dcpoEZ5XdzY0_jGClEUtCN7NAiJ4pUjTJGu34Pd_slkAuVQzQL0hN=w5120-h2880"
          x={422}
          y={1019}
          w={143}
          h={190}
          offsetX={-190.5}
          offsetY={-1746.5}
          scaleX={1203}
        />
        <Image
          url="https://livedoor.blogimg.jp/rabitsokuhou/imgs/e/a/ea85e7d6-s.jpg"
          x={403}
          y={596}
          w={130}
          h={285}
          offsetX={-379.5}
          offsetY={-569.5}
          scaleX={727}
        />
        <Image
          url="https://l-userpic.livejournal.com/90194656/8057372"
          x={415}
          y={799}
          w={87}
          h={86}
          offsetX={-103}
          offsetY={-215}
          scaleX={304}
        />
        <Image
          url="https://s-img.mgid.com/l/513389/492x277/-/aHR0cHM6Ly9jZG4uYmFvcXVvY3RlLnZuL3N0b3Jlcy9uZXdzX2RhdGFpbWFnZXMvMjAyNC8xMDIwMjQvMjMvMTEvY3JvcGVkL2Rhbmgtc2FjaC0yMy1jYXUtdGh1LWRvaS10dXllbi11MTctdmlldC1uYW0tdGhhbS1kdS12b25nLWxvYWktZ2lhaS11MTctY2hhdS1hLTIwMjUtMjAyNDEwMjMxMTAxMDMuanBnP3JhbmRUaW1lPTE3Mjk2NjgwODQ.webp?v=1729673937-u8EeeXbGg1aT3U8GOIstDIC1ileyjhF4d7AVqD8DtMI"
          x={256}
          y={831}
          w={109}
          h={260}
          offsetX={-1522}
          offsetY={-1239}
          scaleX={3544}
        />
        <Image
          url="https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/9b1064effab0477eb95c17dc1a955d3e_1723039586?lk3s=b59d6b55&x-expires=1729882800&x-signature=AvmTH0ckchozA%2BQn0ZXAuxJSqSc%3D&shp=b59d6b55&shcp=-"
          x={277}
          y={1067}
          w={73}
          h={160}
          offsetX={-282.5}
          offsetY={-1942.5}
          scaleX={1425}
        />
        <Image
          url="https://avatars.githubusercontent.com/u/2142817?v=3"
          x={426}
          y={885}
          w={104}
          h={136}
          offsetX={-284}
          offsetY={-364}
          scaleX={575}
        />
        <Image
          url="https://ansel.frgimages.com/milwaukee-bucks/glenn-robinson-milwaukee-bucks-signed-8x10-glossy-photo-jsa-authenticated_ss2_p-202336010+pv-1+u-ywxvggplguwsfobpxtla+v-rxtivclgqgjvuljvbjlw.jpg?_hv=2&w=900"
          x={422}
          y={448}
          w={108}
          h={176}
          offsetX={-598.5}
          offsetY={-571.5}
          scaleX={1217}
        />
        <Image
          url="https://rebeccaplotnick.com/cdn/shop/products/MG_7467_small_2048x.jpg?v=1582032689"
          x={61}
          y={275}
          w={87}
          h={84}
          offsetX={-503.5}
          offsetY={-384.5}
          scaleX={1217}
        />
        <Image
          url="https://media.timeout.com/images/105147024/1536/1152/image.webp"
          x={683}
          y={375}
          w={64}
          h={80}
          offsetX={-871.5}
          offsetY={-342.5}
          scaleX={1217}
        />
        <Image
          url="https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto,w_1400/v1653125083/vendor/6621/catalog/product/2/0/20220402023250_file_6247b5d2acf71_6247b61b2bc52.jpg"
          x={580}
          y={819}
          w={180}
          h={169}
          offsetX={-37.5}
          offsetY={-23.5}
          scaleX={245}
        />
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
