import shirt from "../images/items/clothes/shirt.gif";
import luckyShirt from "../images/items/clothes/lucky_shirt.gif";
import sleezeShirt from "../images/items/clothes/sleeze_shirt.gif";
import sanjoseHoodie from "../images/items/clothes/sanjose_hoodie.gif";
import greySweatpants from "../images/items/clothes/grey_sweatpants.gif";
import tiredShirt from "../images/items/clothes/tired_shirt.gif";
import tiredSkirt from "../images/items/clothes/tired_skirt.gif";
import tiredGlasses from "../images/items/clothes/tired_glasses.gif";
import nabHelmet from "../images/items/clothes/nab_helmet.gif";
import nabJacket from "../images/items/clothes/nab_jacket.gif";
import saigonHat from "../images/items/clothes/saigon_hat.gif";
import hanoiHat from "../images/items/clothes/hanoi_hat.gif";
import sirenHair from "../images/items/clothes/siren_hair.gif";
import sirenShirt from "../images/items/clothes/siren_shirt.gif";
import sirenShirt2 from "../images/items/clothes/siren_shirt2.gif";
import sirenGlasses from "../images/items/clothes/siren_glasses.gif";
import tabiShoes from "../images/items/clothes/tabi_shoes.gif";
import chromePants from "../images/items/clothes/chrome_pants.gif";
import investedShirt from "../images/items/clothes/invested_shirt.gif";
import babygirlTank from "../images/items/clothes/babygirl_tank.gif";
import senpaiHair from "../images/items/clothes/senpai_hair.gif";
import coquetteHair from "../images/items/clothes/coquette_hair.gif";
import backdoorPartyHair from "../images/items/clothes/backdoor_party_hair.gif";
import plushie from "../images/items/toys/plushie.gif";
import jelly from "../images/items/food/jelly.gif";

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
      image: shirt,
      cost: 1,
    },
    1: {
      name: "Cool Shirt",
      slot: CLOTHES.SHIRT,
      image: shirt,
      cost: 50,
      special: {
        coinSpawner: 1,
      },
    },
    2: {
      name: "Lucky Shirt",
      slot: CLOTHES.SHIRT,
      image: luckyShirt,
      cost: 50,
      special: {
        lucky: true,
      },
    },
    3: {
      name: "Sleeze Shirt",
      slot: CLOTHES.SHIRT,
      image: sleezeShirt,
      cost: 60,
    },
    4: {
      name: "San Jose Hoodie",
      slot: CLOTHES.SHIRT,
      image: sanjoseHoodie,
      cost: 3,
    },
    5: {
      name: "Grey Sweatpants",
      slot: CLOTHES.PANTS,
      image: greySweatpants,
      cost: 3,
    },
    6: {
      name: "Tired Shirt",
      slot: CLOTHES.SHIRT,
      image: tiredShirt,
      cost: 15,
    },
    7: {
      name: "Tired Skirt",
      slot: CLOTHES.PANTS,
      image: tiredSkirt,
      cost: 15,
    },
    8: {
      name: "Tired Glasses",
      slot: CLOTHES.GLASSES,
      image: tiredGlasses,
      cost: 15,
    },
    9: {
      name: "Nab Helmet",
      slot: CLOTHES.HAT,
      image: nabHelmet,
      cost: 10,
    },
    10: {
      name: "Nab Jacket",
      slot: CLOTHES.SHIRT,
      image: nabJacket,
      cost: 10,
    },
    11: {
      name: "Saigon Hat",
      slot: CLOTHES.HAT,
      image: saigonHat,
      cost: 60,
    },
    12: {
      name: "Hanoi Hat",
      slot: CLOTHES.HAT,
      image: hanoiHat,
      cost: 60,
    },
    13: {
      name: "Siren Hair",
      slot: CLOTHES.HAIR,
      image: sirenHair,
      cost: 100,
    },
    14: {
      name: "Siren Shirt",
      slot: CLOTHES.SHIRT,
      image: sirenShirt,
      cost: 100,
    },
    15: {
      name: "Striped Siren Shirt",
      slot: CLOTHES.SHIRT,
      image: sirenShirt2,
      cost: 100,
    },
    16: {
      name: "Siren Glasses",
      slot: CLOTHES.GLASSES,
      image: sirenGlasses,
      cost: 100,
    },
    17: {
      name: "Tabis",
      slot: CLOTHES.SHOES,
      image: tabiShoes,
      cost: 300,
    },
    18: {
      name: "Chrome Pants",
      slot: CLOTHES.PANTS,
      image: chromePants,
      cost: 300,
    },
    19: {
      name: "Invested Shirt",
      slot: CLOTHES.SHIRT,
      image: investedShirt,
      cost: 25,
    },
    20: {
      name: "BabyGirl Tank",
      slot: CLOTHES.SHIRT,
      image: babygirlTank,
      cost: 25,
    },
    21: {
      name: "Senpai Hair",
      slot: CLOTHES.HAIR,
      image: senpaiHair,
      cost: 30,
    },
    22: {
      name: "Coquette Hair",
      slot: CLOTHES.HAIR,
      image: coquetteHair,
      cost: 30,
    },
    23: {
      name: "Backdoor Party Hair",
      slot: CLOTHES.HAIR,
      image: backdoorPartyHair,
      cost: 30,
    },
  },
  toys: {
    0: {
      name: "Plushie",
      image: plushie,
      cost: 5,
      happiness: 10,
    },
  },
  food: {
    0: {
      name: "Jelly",
      image: jelly,
      cost: 5,
      hp: 10,
    },
    1: {
      name: "Big Jelly",
      image: jelly,
      cost: 10,
      hp: 20,
    },
  },
};
