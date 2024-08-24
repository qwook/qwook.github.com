export const CLOTHES = {
  SHIRT: 0,
  PANTS: 1,
  HAIR: 2,
  SHOES: 3,
  GLASSES: 4,
  HAT: 5,
};

export const items = {
  clothes: {
    0: {
      name: "Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/shirt.gif"),
      cost: 1,
    },
    1: {
      name: "Cool Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/shirt.gif"),
      cost: 50,
      special: {
        coinSpawner: 1,
      },
    },
    2: {
      name: "Lucky Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/lucky_shirt.gif"),
      cost: 50,
      special: {
        lucky: true,
      },
    },
    3: {
      name: "Sleeze Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/sleeze_shirt.gif"),
      cost: 60,
    },
    4: {
      name: "San Jose Hoodie",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/sanjose_hoodie.gif"),
      cost: 3,
    },
    5: {
      name: "Grey Sweatpants",
      slot: CLOTHES.PANTS,
      image: require("../images/items/clothes/grey_sweatpants.gif"),
      cost: 3,
    },
    6: {
      name: "Tired Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/tired_shirt.gif"),
      cost: 15,
    },
    7: {
      name: "Tired Skirt",
      slot: CLOTHES.PANTS,
      image: require("../images/items/clothes/tired_skirt.gif"),
      cost: 15,
    },
    8: {
      name: "Tired Glasses",
      slot: CLOTHES.GLASSES,
      image: require("../images/items/clothes/tired_glasses.gif"),
      cost: 15,
    },
    9: {
      name: "Nab Helmet",
      slot: CLOTHES.HAT,
      image: require("../images/items/clothes/nab_helmet.gif"),
      cost: 10,
    },
    10: {
      name: "Nab Jacket",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/nab_jacket.gif"),
      cost: 10,
    },
    11: {
      name: "Saigon Hat",
      slot: CLOTHES.HAT,
      image: require("../images/items/clothes/saigon_hat.gif"),
      cost: 60,
    },
    12: {
      name: "Hanoi Hat",
      slot: CLOTHES.HAT,
      image: require("../images/items/clothes/hanoi_hat.gif"),
      cost: 60,
    },
    13: {
      name: "Siren Hair",
      slot: CLOTHES.HAIR,
      image: require("../images/items/clothes/siren_hair.gif"),
      cost: 100,
    },
    14: {
      name: "Siren Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/siren_shirt.gif"),
      cost: 100,
    },
    15: {
      name: "Striped Siren Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/siren_shirt2.gif"),
      cost: 100,
    },
    16: {
      name: "Siren Glasses",
      slot: CLOTHES.GLASSES,
      image: require("../images/items/clothes/siren_glasses.gif"),
      cost: 100,
    },
    17: {
      name: "Tabis",
      slot: CLOTHES.SHOES,
      image: require("../images/items/clothes/tabi_shoes.gif"),
      cost: 300,
    },
    18: {
      name: "Chrome Pants",
      slot: CLOTHES.PANTS,
      image: require("../images/items/clothes/chrome_pants.gif"),
      cost: 300,
    },
    19: {
      name: "Invested Shirt",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/invested_shirt.gif"),
      cost: 25,
    },
    20: {
      name: "BabyGirl Tank",
      slot: CLOTHES.SHIRT,
      image: require("../images/items/clothes/babygirl_tank.gif"),
      cost: 25,
    },
    21: {
      name: "Senpai Hair",
      slot: CLOTHES.HAIR,
      image: require("../images/items/clothes/senpai_hair.gif"),
      cost: 30,
    },
    22: {
      name: "Coquette Hair",
      slot: CLOTHES.HAIR,
      image: require("../images/items/clothes/coquette_hair.gif"),
      cost: 30,
    },
    23: {
      name: "Backdoor Party Hair",
      slot: CLOTHES.HAIR,
      image: require("../images/items/clothes/backdoor_party_hair.gif"),
      cost: 30,
    },
  },
  toys: {
    0: {
      name: "Plushie",
      image: require("../images/items/toys/plushie.gif"),
      cost: 5,
      happiness: 10,
    },
  },
  food: {
    0: {
      name: "Jelly",
      image: require("../images/items/food/jelly.gif"),
      cost: 5,
      hp: 10,
    },
    1: {
      name: "Big Jelly",
      image: require("../images/items/food/jelly.gif"),
      cost: 10,
      hp: 20,
    },
  },
};
