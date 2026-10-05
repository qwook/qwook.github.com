import heart from "./images/icons/heart.png";
import smiley from "./images/icons/smiley.png";
import flower from "./images/icons/flower.png";

const Symbols = {
  Health: function () {
    return (
      <span
        className="symbol"
        style={{
          display: "inline-block",
          verticalAlign: "top",
          width: "1em",
          height: "1em",
          backgroundImage: `url("${heart}")`,
          backgroundSize: "cover",
        }}
      ></span>
    );
  },
  Happiness: function () {
    return (
      <span
        className="symbol"
        style={{
          display: "inline-block",
          verticalAlign: "top",
          width: "1em",
          height: "1em",
          backgroundImage: `url("${smiley}")`,
          backgroundSize: "cover",
        }}
      ></span>
    );
  },
  Points: function () {
    return (
      <span
        className="symbol"
        style={{
          display: "inline-block",
          verticalAlign: "top",
          width: "1em",
          height: "1em",
          backgroundImage: `url("${flower}")`,
          backgroundSize: "cover",
        }}
      ></span>
    );
  },
};

export default Symbols;
