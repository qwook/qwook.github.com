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
          backgroundImage: `url("${require("./images/icons/heart.png")}")`,
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
          backgroundImage: `url("${require("./images/icons/smiley.png")}")`,
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
          backgroundImage: `url("${require("./images/icons/flower.png")}")`,
          backgroundSize: "cover",
        }}
      ></span>
    );
  },
};

export default Symbols;
