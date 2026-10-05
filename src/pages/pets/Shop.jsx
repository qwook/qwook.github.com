import { Item, ItemList } from "./ItemList";
import { useContext, useState } from "react";

import { PetsContext } from "./PetsContext";
import Tabs from "./Tabs";
import { items } from "./data/items";

export default function Shop() {
  const [tab, setTab] = useState("clothes");

  const { buyItem, setPopUp } = useContext(PetsContext);

  return (
    <>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Tabs
          tabs={[
            { id: "clothes", text: "Clothes" },
            { id: "toys", text: "Toys" },
            { id: "food", text: "Food" },
          ]}
          currentTab={tab}
          onTabChange={(tab) => {
            setPopUp(null);
            setTab(tab);
          }}
        />
      </div>
      <br />
      <ItemList>
        {items[tab] &&
          Object.keys(items[tab]).map((key) => {
            const item = items[tab][key];
            return (
              <Item
                key={`${tab}-${key}`}
                type={tab}
                id={key}
                showPrice
                {...item}
                actions={[{ id: "buy", text: "Buy" }]}
                onAction={(action) => {
                  if (action === "buy") {
                    buyItem(tab, key);
                  }
                }}
              />
            );
          })}
      </ItemList>
    </>
  );
}
