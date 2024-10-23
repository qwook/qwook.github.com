import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";
import HTMLFestCarousel from "../components/HTMLFestCarousel";
import "./polaroids.scss";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";
import PolaroidsUniverse from "../components/polaroids/PolaroidsUniverse";

import "./chao.scss";

const lineup = [
  {
    name: "Alex Togashii",
    image: require("./images/chao/artists/2.jpg"),
    description: "alex is cool as a cat, with a chill indie rock sound.",
    spotify:
      "https://open.spotify.com/artist/0HVbw8ntLBVDL9fpJYMljZ?si=C7bsafP2RuO9oWR5lZP0tg",
    instagram: "",
  },
  {
    name: "squidlip",
    image: require("./images/chao/artists/3.jpg"),
    description: "male phoebe bridgers",
  },
  {
    name: "chriuung",
    image: require("./images/chao/artists/1.jpg"),
    description: "chris has a high-energy modern pop punk sound.",
    spotify:
      "https://open.spotify.com/artist/2WzIXzBSWU8B8YBOqBW8y6?si=hQwBpqf8TeSvdSOy0hpxXw",
    instagram: "https://www.instagram.com/chriung/",
  },
  {
    name: "??????? ????",
    description: "guitar + vocal guy with curly hair",
  },
  {
    name: "????? ???????",
    description: "jazzy band",
  },
  {
    name: "entropic sonics",
    image: require("./images/chao/artists/4.jpg"),
    description:
      "entropic is known for experimental, deep and heavy ambient-like soundscapes",
    instagram: "https://www.instagram.com/entropicsonics/",
    spotify:
      "https://open.spotify.com/artist/56vHwrGX0i4i9DzNu7EBz6?si=7CL7lf70RXWsuvTbe0KcOg",
  },
];

const kylaShop = [
  {
    image: require("./images/chao/kyla_shop/IMG_9512.jpg"),
    properties: [],
  },
  {
    image: require("./images/chao/kyla_shop/IMG_9514.jpg"),
    properties: [],
  },
  {
    image: require("./images/chao/kyla_shop/IMG_9518.jpg"),
    properties: [],
  },
  {
    image: require("./images/chao/kyla_shop/IMG_9523.jpg"),
    properties: [],
  },
  {
    image: require("./images/chao/kyla_shop/IMG_9529.jpg"),
    properties: [],
  },
  {
    image: require("./images/chao/kyla_shop/IMG_9533.jpg"),
    properties: [],
  },
];

const kailShop = [];

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

function Shop({ inventory }) {
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

export default function ChaoPage() {
  const [artistPage, setArtistPage] = useState();
  const [shopPage, setShopPage] = useState();

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
        ? a love letter to san francisco with a hint of nhậu. but also
        literally just my backyard with friends. there will be live music and
        thrifting!
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
          height: artistPage ? "30vw" : "0vw",
          opacity: artistPage ? "1" : "0",
        }}
      >
        {artistPage && (
          <>
            {artistPage.image && (
              <div
                className="photos"
                style={{
                  height: "25vw",
                  width: "30vw",
                }}
              >
                <div
                  className="image"
                  style={{
                    display: "flex",
                    transform: "rotate(5deg)",
                  }}
                >
                  <img
                    style={{
                      width: "20vw",
                    }}
                    src={artistPage.image}
                  />
                </div>
              </div>
            )}
            <div
              className="artist-content"
              style={{
                width: "40vw",
              }}
            >
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
            }
          }}
        >
          &gt; coming soon: ????'s thrift shop
        </ShopButton>
      </p>
      <div className="shop">
        {shopPage && <Shop inventory={shopPage}></Shop>}
      </div>
      <p className="photos">
        <div
          className="image"
          style={{
            top: "5vw",
            left: "0vw",
            transform: "rotate(-5deg)",
          }}
        >
          <img
            style={{
              width: "40vw",
            }}
            src={require("./images/chao/photos/1.jpg")}
          />
        </div>
        <div
          className="image"
          style={{
            top: "0vw",
            left: "45vw",
            transform: "rotate(5deg)",
          }}
        >
          <img
            style={{
              width: "30vw",
            }}
            src={require("./images/chao/photos/2.jpg")}
          />
        </div>
      </p>
      <p>
        san francisco was always my dream city. i used to take the BART up from
        south bay all the time to explore the city, look at vinyl records, and
        go thrifting.
      </p>
      <p>"To nhậu is to drink and to eat socially [...], to release oneself of daily burdens through communal imbibing, and to revel in the quaintness of life." - <a href="https://colorbloq-qtpoc-4011.squarespace.com/in-food-and-community-how-vietnamese-drinking-culture-taught-me-to-love-my-queerness">Alex Nguyen</a></p>
      <p>i've always embedded the spirit of 'nhậu' into my events. it's what i was raised with. but 'nhậu' isn't just about drinking, it's about togetherness and connection. i'm excited to share one last san franciscan nhậu with you all!</p>
    </div>
  );
}

createPage(ChaoPage, { showPets: false, showNav: false });
