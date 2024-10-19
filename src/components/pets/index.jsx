import { CLOTHES, items } from "./data/items";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Flower from "./Flower";
import Inventory from "./Inventory";
import { PetsContext } from "./PetsContext";
import Shop from "./Shop";
import Symbols from "./Symbols";
import Tabs from "./Tabs";
import defaultImage from "./images/default_pet.gif";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { v4 as uuidv4 } from "uuid";

export default function Pets() {
  const [message, setMessage] = useLocalStorageState(
    "message",
    "Hello, world! Collect flowers to buy items!"
  );
  const [health, setHealth] = useLocalStorageState("health", 100);
  const [happiness, setHappiness] = useLocalStorageState("happiness", 100);
  const [money, setMoney] = useLocalStorageState("money", 0);
  const [inventory, setInventory] = useLocalStorageState("inventory", []);
  const [equipped, setEquipped] = useLocalStorageState("equipped", {});

  const [popUp, setPopUp] = useState();
  const [tab, setTab] = useState("hide");
  const [messageIdx, setMessageIdx] = useState(0);

  const moneyDiv = useRef();

  const buyItem = useCallback(
    (type, id) => {
      const item = items[type][id];
      if (!item) return;
      if (money < item.cost) {
        setMessage("You can't afford that!");
        setMessageIdx(1);
        return;
      }

      // Generate a unique item.
      const newItem = {
        uuid: uuidv4(),
        type: type,
        id: id,
      };

      setMessage(`You bought ${item.name}.`);
      setMessageIdx(0);
      setMoney((money) => money - item.cost);
      setInventory((inventory) => [...inventory, newItem]);
    },
    [money, setInventory]
  );

  const trashItem = useCallback(
    (itemPtr) => {
      const item = items[itemPtr.type][itemPtr.id];
      setMessage(`You trashed ${item.name}.`);
      setMessageIdx(1);

      setInventory((inventory) =>
        inventory.filter((item) => item.uuid !== itemPtr.uuid)
      );
    },
    [setMessage, setMessageIdx, setInventory]
  );

  const eatItem = useCallback(
    (itemPtr) => {
      const item = items[itemPtr.type][itemPtr.id];
      setMessage(`Yummy, ${item.name} was good.`);
      setMessageIdx(1);

      setHealth((health) => Math.min(health + item.hp, 100));
      setInventory((inventory) =>
        inventory.filter((item) => item.uuid !== itemPtr.uuid)
      );
    },
    [setMessage, setMessageIdx, setInventory]
  );

  const playWithItem = useCallback(
    (itemPtr) => {
      const item = items[itemPtr.type][itemPtr.id];
      const probability = Math.random();
      if (probability < 0.7) {
        setMessage(`I love playing with ${item.name}!`);
        setHappiness((happiness) => happiness + item.happiness);
      } else {
        setMessage(`Oh, ${item.name} wasn't particularly fun.`);
        setHappiness((happiness) => happiness + item.happiness / 2);
      }
      setMessageIdx(1);

      setInventory((inventory) =>
        inventory.filter((item) => item.uuid !== itemPtr.uuid)
      );
    },
    [setMessage, setMessageIdx, setInventory]
  );

  const equipItem = useCallback(
    (itemPtr) => {
      const item = items[itemPtr.type][itemPtr.id];
      setMessage(`Wow... ${item.name} fits just right!`);
      setMessageIdx(1);

      setEquipped((equipped) => {
        if (equipped[item.slot]?.uuid !== itemPtr.uuid) {
          return {
            ...equipped,
            [item.slot]: itemPtr,
          };
        } else {
          return equipped;
        }
      });
    },
    [setMessage, setMessageIdx, setInventory]
  );

  const unEquipItem = useCallback(
    (itemPtr) => {
      const item = items[itemPtr.type][itemPtr.id];
      setMessage(`Oooh, it's a little breezy now.`);
      setMessageIdx(1);

      setEquipped((equipped) => {
        if (equipped[item.slot]?.uuid === itemPtr.uuid) {
          delete equipped[item.slot];
          return {
            ...equipped,
          };
        } else {
          return equipped;
        }
      });
    },
    [setMessage, setMessageIdx, setInventory]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (messageIdx < message.length + 2) {
        setMessageIdx((messageIdx) => messageIdx + 1);
      }
    }, 20);

    return () => {
      clearTimeout(timeout);
    };
  }, [message, messageIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((health) => Math.max(health - 1, 0));
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const coinsVisible = useMemo(() => {
    let coins = 1;
    for (const itemPtr of Object.values(equipped)) {
      const item = items[itemPtr.type][itemPtr.id];
      item.special?.coinSpawner && (coins += item.special?.coinSpawner);
    }
    return coins;
  }, [equipped]);

  const displayEquip = (type) => {
    const itemPtr = equipped[type];
    if (!itemPtr) return;
    const item = items[itemPtr.type][itemPtr.id];
    if (item) {
      return (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 250,
          }}
          src={item.image}
          alt="default pet"
        />
      );
    }
  };

  return (
    <>
      <PetsContext.Provider
        value={{
          // Actions
          buyItem,
          trashItem,
          eatItem,
          playWithItem,
          equipItem,
          unEquipItem,
          // Pet attributes
          message,
          setMessage,
          health,
          setHealth,
          happiness,
          setHappiness,
          money,
          setMoney,
          inventory,
          setInventory,
          equipped,
          setEquipped,
          // Popup
          popUp,
          setPopUp,
        }}
      >
        <div className="pet-window">
          <div className="pet-view-and-message">
            <div
              className="pet-view"
              style={{
                position: "relative",
              }}
            >
              <img
                style={{
                  width: 250,
                }}
                src={defaultImage}
                alt="default pet"
              />
              {displayEquip(CLOTHES.GLASSES)}
              {displayEquip(CLOTHES.HAIR)}
              {displayEquip(CLOTHES.HAT)}
              {displayEquip(CLOTHES.SHOES)}
              {displayEquip(CLOTHES.PANTS)}
              {displayEquip(CLOTHES.SHIRT)}
            </div>
            <div
              style={{
                fontStyle: "italic",
                minHeight: 50,
              }}
            >
              {`"${message}"`.slice(0, messageIdx)}
            </div>
          </div>
          <div className="pet-stats">
            <div className="stat">
              <div className="stat-description">
                <Symbols.Health /> Hunger and health.
              </div>
              <div className="stat-value">
                <Symbols.Health /> {health} / 100
              </div>
            </div>
            <div className="stat">
              <div className="stat-description">
                <Symbols.Happiness /> Happiness from toys.
              </div>
              <div className="stat-value">
                <Symbols.Happiness /> {Math.floor(happiness)} / 100
              </div>
            </div>
            <div className="stat" ref={moneyDiv}>
              <div className="stat-description">
                <Symbols.Points /> Used to buy stuff.
              </div>
              <div className="stat-value">
                <Symbols.Points /> {money}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div>
          <div
            style={{
              background: "#ddd",
              textAlign: "center",
              padding: 5,
            }}
          >
            <Tabs
              tabs={[
                { id: "shop", text: "Shop" },
                { id: "inventory", text: "Inventory" },
                { id: "hide", text: "[Hide]" },
              ]}
              currentTab={tab}
              onTabChange={(tab) => {
                setPopUp(null);
                setTab(tab);
              }}
            />
          </div>
          {tab === "shop" && <Shop />}
          {tab === "inventory" && <Inventory />}
        </div>
        {(() => {
          let coinComponents = [];
          for (let i = 0; i < coinsVisible; i++) {
            coinComponents.push(
              <Flower
                key={i}
                onEarn={(value) => {
                  setMoney((money) => money + value);
                  setHappiness((happiness) => Math.max(happiness - 0.5, 0));
                }}
                earnGoalEle={moneyDiv}
              />
            );
          }
          return coinComponents;
        })()}
      </PetsContext.Provider>
    </>
  );
}
