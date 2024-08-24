import { Item, ItemList } from "./ItemList";
import { useContext, useState } from "react";

import { PetsContext } from "./PetsContext";
import Tabs from "./Tabs";
import { items } from "./items";

export default function Inventory() {
  const {
    inventory,
    trashItem,
    eatItem,
    playWithItem,
    equipItem,
    unEquipItem,
    equipped,
  } = useContext(PetsContext);

  return (
    <>
      <br />
      <ItemList>
        {inventory.map((itemPtr) => {
          const item = items[itemPtr.type][itemPtr.id];
          const actions = [];
          if (itemPtr.type === "clothes") {
            if (equipped[item.slot]?.uuid === itemPtr.uuid) {
              actions.push({ id: "unequip", text: "Un-Equip" });
            } else {
              actions.push({ id: "equip", text: "Equip" });
            }
          } else if (itemPtr.type === "toys") {
            actions.push({ id: "playwith", text: "Play With" });
          } else if (itemPtr.type === "food") {
            actions.push({ id: "eat", text: "Eat" });
          }
          actions.push({ id: "", text: "" });
          actions.push({ id: "trash", text: "Trash" });
          return (
            <Item
              key={itemPtr.uuid}
              type={itemPtr.type}
              id={itemPtr.id}
              uuid={itemPtr.uuid}
              {...item}
              actions={actions}
              onAction={(action) => {
                if (action === "trash") {
                  trashItem(itemPtr);
                } else if (action === "eat") {
                  eatItem(itemPtr);
                } else if (action === "playwith") {
                  playWithItem(itemPtr);
                } else if (action === "equip") {
                  equipItem(itemPtr);
                } else if (action === "unequip") {
                  unEquipItem(itemPtr);
                }
              }}
            />
          );
        })}
      </ItemList>
    </>
  );
}
