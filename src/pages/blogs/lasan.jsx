import Banner from "../../components/Banner";
import { createPage } from "../../app";
import { useRef, useState } from "react";

function HiddenScope({ needle, children, width = 120, height = 50 }) {
  const haystackRef = useRef();
  const needleRef = useRef();
  const needleOffsetRef = useRef();
  const scopeRef = useRef();

  const [display, setDisplay] = useState(false);

  return (
    <div
      ref={haystackRef}
      onMouseMove={(e) => {
        scopeRef.current.style.left =
          e.pageX - haystackRef.current.offsetLeft - width / 2 + "px";
        scopeRef.current.style.top =
          e.pageY - haystackRef.current.offsetTop - height / 2 + "px";
        needleRef.current.style.left =
          e.pageX - haystackRef.current.offsetLeft - width / 2 + "px";
        needleRef.current.style.top =
          e.pageY - haystackRef.current.offsetTop - height / 2 + "px";
        needleOffsetRef.current.style.left =
          -(e.pageX - haystackRef.current.offsetLeft - width / 2) + "px";
        needleOffsetRef.current.style.top =
          -(e.pageY - haystackRef.current.offsetTop - height / 2) + "px";
      }}
      onMouseEnter={(e) => {
        setDisplay(true);
      }}
      onMouseLeave={(e) => {
        setDisplay(false);
      }}
      style={{
        position: "relative",
        cursor: "none",
      }}
    >
      <div
        ref={scopeRef}
        style={{
          display: display ? "block" : "none",
          position: "absolute",
          background: "black",
          width,
          height,
          borderRadius: "50%",
          boxShadow: "0px 0px 10px 10px black",
          userSelect: "none",
          pointerEvents: "none",
        }}
      ></div>
      <div
        ref={needleRef}
        style={{
          display: display ? "block" : "none",
          position: "absolute",
          userSelect: "none",
          pointerEvents: "none",
          color: "white",
          overflow: "hidden",
          width,
          height,
          borderRadius: "50%",
        }}
      >
        <div
          ref={needleOffsetRef}
          style={{
            display: display ? "block" : "none",
            position: "absolute",
            width: 500,
            height: 500,
          }}
        >
          {needle}
        </div>
        <div
          style={{
            display: display ? "block" : "none",
            position: "absolute",
            width,
            height,
            borderRadius: "50%",
            boxShadow: "0px 0px 10px 10px inset black",
          }}
        />
      </div>
      {children}
    </div>
  );
}

export default function Blogs_LaSan() {
  return (
    <div className="blog">
      <Banner>La San</Banner>
      <img src={require("./lasan/vnls-2006 (7).jpg")} />
      <p>
        I went to a Vietnamese Catholic school for 6 years. It was called La
        San.
      </p>
      <img src={require("./lasan/lop-2.jpg")} />
      <p>I think I'm in this picture above.</p>
      <img src={require("./lasan/vnls-04 (7).jpg")} />
      <p>We'd line up for attendance every day.</p>
      <img src={require("./lasan/vnls-00-27.jpg")} />
      <p>
        During recess, kids would crowd around the vending machines. I remember
        buying a lot of sour patch gummies here. In front of the Coca Cola
        vending machine, a guy stole my holographic Summoned Skull Yu-Gi-Oh
        card.
      </p>
      <img src={require("./lasan/vnls-06 (13).jpg")} />
      <img src={require("./lasan/vnls-04 (20).jpg")} />
      <p>These are the iconic tables where we played Yu-Gi-Oh.</p>
      <img src={require("./lasan/vnls-00-11.jpg")} />
      <p>Here's my sister taking a piano class.</p>
      <img src={require("./lasan/ndls-tet-05-0.jpg")} />
      <p>
        I am fascinated by how densely packed the history of Vietnam can be read
        from the above imagery.
      </p>
      <p>
        Vietnam traditionally used Chinese characters in writing before the
        Portuguese brought over latin characters. After that, the French
        colonized Vietnam and brought over Catholicism. In 1954, Catholic
        Vietnamese from the north fled to the south to avoid persecution from
        the Communist Party. When South Vietnam fell, many Vietnamese escaped to
        San Jose (and other places too), which became the largest population of
        Vietnamese outside of Vietnam.
      </p>
      <HiddenScope
        needle={
          <>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp; rebirth from chaos of arcane sins, the end (11)
          </>
        }
      >
        <p>
          In the above picture, you can see <strong>Chinese</strong>{" "}
          calligraphy, along with <strong>Vietnamese</strong> text written in{" "}
          <strong>Portuguese</strong>
          -imported Latin characters. All of this is set up in a{" "}
          <strong>Catholic</strong> school in <strong>San Jose</strong> that was
          named after a <strong>French</strong> priest named La Salle.
        </p>
      </HiddenScope>
      <HiddenScope needle={<>Hey Isabel, happy birthday! From Henry :) </>}>
        I was raised both <a href="/god">Catholic</a> and Buddhist, attending
        both church and temples. I identify with both religions and take from
        both.
      </HiddenScope>
      <p>
        I hated this school because it was on Saturday morning and it made me
        miss my Saturday morning cartoons.
      </p>
    </div>
  );
}

createPage(Blogs_LaSan);
