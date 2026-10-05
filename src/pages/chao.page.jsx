import Banner from "@/common/components/Banner";
import Carousel from "@/common/components/Carousel";

import HTMLFestCarousel from "@/common/components/HTMLFestCarousel";
import "./polaroids.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";
import PolaroidsUniverse from "@/common/components/polaroids/PolaroidsUniverse";

import "./chao.css";
import Layout from "@/common/layout/Layout";
import img2 from "./images/chao/artists/2.jpg";
import img3 from "./images/chao/artists/3.jpg";
import img1 from "./images/chao/artists/1.jpg";
import img5 from "./images/chao/artists/5.jpg";
import img4 from "./images/chao/artists/4.jpg";
import img9512 from "./images/chao/kyla_shop/IMG_9512.jpg";
import img9514 from "./images/chao/kyla_shop/IMG_9514.jpg";
import img9518 from "./images/chao/kyla_shop/IMG_9518.jpg";
import img9523 from "./images/chao/kyla_shop/IMG_9523.jpg";
import img9529 from "./images/chao/kyla_shop/IMG_9529.jpg";
import img9533 from "./images/chao/kyla_shop/IMG_9533.jpg";
import p0 from "./images/chao/kail_shop/P0.jpg";
import p01 from "./images/chao/kail_shop/P0-1.jpg";
import p02 from "./images/chao/kail_shop/P0-2.jpg";
import p03 from "./images/chao/kail_shop/P0-3.jpg";
import p04 from "./images/chao/kail_shop/P0-4.jpg";
import p05 from "./images/chao/kail_shop/P0-5.jpg";
import img12 from "./images/chao/photos/1.jpg";
import img22 from "./images/chao/photos/2.jpg";
import parking from "./images/chao/parking.png";

// This page nests <div>s inside <p>s, which the browser's HTML parser
// rearranges, so its server-rendered markup can't be hydrated. It's still
// served pre-rendered, then rendered fresh in the browser.
export const hydrate = false;

const lineup = [
  {
    name: "Alex Togashii",
    image: img2,
    description: "alex is cool as a cat, with a chill indie rock sound.",
    spotify:
      "https://open.spotify.com/artist/0HVbw8ntLBVDL9fpJYMljZ?si=C7bsafP2RuO9oWR5lZP0tg",
    instagram: "",
  },
  {
    name: "squidlip",
    image: img3,
    description: "male phoebe bridgers",
  },
  {
    name: "chriuung",
    image: img1,
    description: "chris has a high-energy modern pop punk sound.",
    spotify:
      "https://open.spotify.com/artist/2WzIXzBSWU8B8YBOqBW8y6?si=hQwBpqf8TeSvdSOy0hpxXw",
    instagram: "https://www.instagram.com/chriung/",
  },
  {
    name: "nun fiction",
    image: img5,
    description: "noisy indie rock band rock band >:) !",
  },
  {
    name: "entropic sonics",
    image: img4,
    description:
      "entropic is known for experimental, deep and heavy ambient-like soundscapes",
    instagram: "https://www.instagram.com/entropicsonics/",
    spotify:
      "https://open.spotify.com/artist/56vHwrGX0i4i9DzNu7EBz6?si=7CL7lf70RXWsuvTbe0KcOg",
  },
];

const kylaShop = [
  {
    image: img9512,
    properties: [],
  },
  {
    image: img9514,
    properties: [],
  },
  {
    image: img9518,
    properties: [],
  },
  {
    image: img9523,
    properties: [],
  },
  {
    image: img9529,
    properties: [],
  },
  {
    image: img9533,
    properties: [],
  },
];

const kailShop = [
  {
    image: p0,
    properties: [],
  },
  {
    image: p01,
    properties: [],
  },
  {
    image: p02,
    properties: [],
  },
  {
    image: p03,
    properties: [],
  },
  {
    image: p04,
    properties: [],
  },
  {
    image: p05,
    properties: [],
  },
];

function Act({ act, onClick }) {
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(1);
  const [bold, setBold] = useState(false);

  function randomize() {
    setRotation(Math.random() * 4 - 2);
    setBold(Math.random() > 0.5);
    setSize(Math.random() * 0.3 + 0.7);
  }

  useEffect(() => {
    randomize();
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        randomize();
      }, 1000);
    }, Math.random() * 2000);
    return () => {
      clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, []);

  return (
    <div className="act" onClick={onClick}>
      <div
        className="wiggler"
        style={{
          fontWeight: bold ? "bold" : "normal",
          transform: `rotate(${rotation}deg) scale(${size})`,
        }}
      >
        {act.name}
      </div>
      <div className="spacer">{act.name}</div>
    </div>
  );
}

function Shop({ inventory, seeMore = "" }) {
  return (
    <>
      {inventory.map((inventory, idx) => {
        return (
          <div className="item" key={idx}>
            <img src={inventory.image} />
            <div className="properties">
              {inventory.properties.map((property) => {
                return (
                  <div className="property">
                    <strong>{property.name}</strong>: {property.value}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {seeMore && (
        <>
          <a
            href={seeMore}
            target="_blank"
            style={{
              paddingBottom: 20,
              width: "100%",
              textAlign: "center",
            }}
          >
            See More &gt;
          </a>
        </>
      )}
    </>
  );
}

function ShopButton({ children, onClick }) {
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(1);
  const [bold, setBold] = useState(false);

  function randomize() {
    setRotation(Math.random() * 4 - 2);
    setBold(Math.random() > 0.5);
    setSize(Math.random() * 0.3 + 0.7);
  }

  useEffect(() => {
    randomize();
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        randomize();
      }, 1000);
    }, Math.random() * 2000);
    return () => {
      clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, []);

  return (
    <div className="thrift" onClick={onClick}>
      <div
        style={{
          fontWeight: bold ? "bold" : "normal",
          transform: `rotate(${rotation}deg) scale(${size})`,
        }}
      >
        <span className="button">{children}</span>
      </div>
    </div>
  );
}

function Lineup({ onActClick }) {
  return (
    <div className="lineup">
      {lineup.map((act, idx) => {
        return (
          <Act
            key={idx}
            act={act}
            onClick={(e) => {
              onActClick(act);
            }}
          />
        );
      })}
    </div>
  );
}

function ChaoPage() {
  const [artistPage, setArtistPage] = useState();
  const [shopPage, setShopPage] = useState();
  const [seeMoreLink, setSeeMoreLink] = useState();

  const shopRef = useRef();

  return (
    <div className="chao">
      <h1>
        chào t<span className="nang">a</span>m bi
        <span className="carot">
          <span className="nang">e</span>
        </span>
        t (goodbye), sf!!! <sub>nov.10 2024</sub>
      </h1>
      <p>
        ? a love letter to san francisco with a hint of nhậu. but also literally
        just my backyard with friends. there will be live music and thrifting!
      </p>
      <Lineup
        onActClick={(act) => {
          if (artistPage === act) {
            setArtistPage(null);
          } else {
            setArtistPage(act);
          }
        }}
      />
      <div
        className="artist-page"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // margin: "4vw",
          height: artistPage ? "200px" : "0px",
          opacity: artistPage ? "1" : "0",
        }}
      >
        {artistPage && (
          <>
            {artistPage.image && (
              <div className="photos" style={{}}>
                <div
                  className="image"
                  style={{
                    display: "flex",
                    transform: "rotate(5deg) translateY(-50%)",
                  }}
                >
                  <img src={artistPage.image} />
                </div>
              </div>
            )}
            <div className="artist-content" style={{}}>
              <div className="description">{artistPage.description}</div>
              <div className="links">
                {artistPage.spotify && (
                  <a target="_blank" href={artistPage.spotify}>
                    spotify
                  </a>
                )}
                {artistPage.instagram && (
                  <a target="_blank" href={artistPage.instagram}>
                    instagram
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <p className="thrifts" ref={shopRef}>
        <ShopButton
          onClick={() => {
            if (shopPage === kylaShop) {
              setShopPage(null);
            } else {
              setShopPage(kylaShop);
              setTimeout(() => {
                shopRef.current.scrollIntoView({ behavior: "smooth" });
              }, 100);
              setSeeMoreLink("https://www.depop.com/robots3xdoll");
            }
          }}
        >
          &gt; preview kyla's thrift shop
        </ShopButton>
        <ShopButton
          onClick={() => {
            if (shopPage === kailShop) {
              setShopPage(null);
            } else {
              setShopPage(kailShop);
              setTimeout(() => {
                shopRef.current.scrollIntoView({ behavior: "smooth" });
              }, 100);
              setSeeMoreLink("https://depop.app.link/u1bV32U9hOb");
            }
          }}
        >
          &gt; preview kail's thrift shop
        </ShopButton>
      </p>
      <div className="shop">
        {shopPage && <Shop inventory={shopPage} seeMore={seeMoreLink}></Shop>}
      </div>
      <p className="photos">
        <div
          className="image image-1"
          style={{
            transform: "rotate(-5deg)",
          }}
        >
          <img style={{}} src={img12} />
        </div>
        <div
          className="image image-2"
          style={{
            transform: "rotate(5deg)",
          }}
        >
          <img style={{}} src={img22} />
        </div>
      </p>
      <h3>what to expect</h3>
      <p>
        halloween costumes. potluck table (bring food or snacks). live music.
        shopping. weird doorbell website.
      </p>
      <h3>parking</h3>
      <p>
        You'll have better luck on Shotwell and east of Shotwell. The more you
        go west, the closer you will be to nightlife. Don't leave anything
        visible in your cars. I put green lines on street I usually see that are
        free. I also live near 16th Street BART station.
      </p>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <img
          src={parking}
          style={{
            width: "50%",
          }}
        />
      </div>
      <h3>some lore</h3>
      <p>
        san francisco was always my dream city. i used to take the BART up from
        south bay all the time to explore the city, look at vinyl records, and
        go thrifting.
      </p>
      <p>
        "To nhậu is to drink and to eat socially [...], to release oneself of
        daily burdens through communal imbibing, and to revel in the quaintness
        of life." -{" "}
        <a href="https://colorbloq-qtpoc-4011.squarespace.com/in-food-and-community-how-vietnamese-drinking-culture-taught-me-to-love-my-queerness">
          Alex Nguyen
        </a>
      </p>
      <p>
        i've always embedded the spirit of 'nhậu' into my events. it's what i
        was raised with. but 'nhậu' isn't just about drinking, it's about
        togetherness and connection. i'm excited to share one last san
        franciscan nhậu with you all!
      </p>
    </div>
  );
}

export default function Root() {
  return (
    <Layout showNav={false}>
      <ChaoPage />
    </Layout>
  );
}
