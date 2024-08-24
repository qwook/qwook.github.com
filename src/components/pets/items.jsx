export const CLOTHES = {
  SHIRT: 0,
};

export const items = {
  clothes: {
    0: {
      name: "Shirt",
      slot: CLOTHES.SHIRT,
      image: require("./images/items/clothes/shirt.gif"),
      cost: 1,
    },
    1: {
      name: "Cool Shirt",
      slot: CLOTHES.SHIRT,
      image: require("./images/items/clothes/shirt.gif"),
      cost: 50,
      special: {
        coinSpawner: 1,
      },
    },
    2: {
      name: "Lucky Shirt",
      slot: CLOTHES.SHIRT,
      image: require("./images/items/clothes/lucky_shirt.gif"),
      cost: 50,
      special: {
        lucky: true,
      },
    },
    3: {
      name: "Normal Shirt",
      slot: CLOTHES.SHIRT,
      image: require("./images/items/clothes/shirt.gif"),
      cost: 5,
    },
  },
  toys: {
    0: {
      name: "Plushie",
      image: require("./images/items/toys/plushie.gif"),
      cost: 5,
      happiness: 10,
    },
  },
  food: {
    0: {
      name: "Jelly",
      image: require("./images/items/food/jelly.gif"),
      cost: 5,
      hp: 10,
    },
    1: {
      name: "Big Jelly",
      image: require("./images/items/food/jelly.gif"),
      cost: 10,
      hp: 20,
    },
  },
};
