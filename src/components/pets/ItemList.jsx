import { useContext, useState } from "react";

import { CLOTHES } from "./data/items";
import { PetsContext } from "./PetsContext";
import Symbols from "./Symbols";

export function Item({
  type,
  id,
  uuid = 0,
  name,
  image,
  cost,
  special,
  hp,
  slot,
  happiness,
  actions,
  onAction,
  showPrice,
}) {
  const identifier = `${type}-${id}-${uuid}`;
  const { popUp, setPopUp, equipped } = useContext(PetsContext);

  let offsetX = 0;
  let offsetY = 0;
  let width = 100;
  let height = 100;

  if (slot === CLOTHES.SHIRT) {
    offsetX = -50;
    offsetY = -75;
    width = 200;
    height = 200;
  } else if (slot === CLOTHES.HAT) {
    offsetX = -40;
    offsetY = -5;
    width = 190;
    height = 190;
  } else if (slot === CLOTHES.HAIR) {
    offsetX = -20;
    offsetY = -5;
    width = 140;
    height = 140;
  } else if (slot === CLOTHES.GLASSES) {
    offsetX = -40;
    offsetY = -25;
    width = 190;
    height = 190;
  } else if (slot === CLOTHES.PANTS) {
    offsetX = -45;
    offsetY = -100;
    width = 190;
    height = 190;
  } else if (slot === CLOTHES.SHOES) {
    offsetX = -45;
    offsetY = -110;
    width = 190;
    height = 190;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexBasis: 76,
        fontSize: 14,
        position: "relative",
      }}
    >
      <div
        style={{
          border:
            equipped[slot]?.uuid === uuid
              ? "3px solid black"
              : "1px solid grey",
          cursor: "pointer",
          width: 71,
          height: 71,
          position: "relative",
          overflow: "hidden",
          boxShadow: type === "clothes" ? "inset 0px 0px 10px 7px white" : null,
        }}
        onClick={(e) => {
          setPopUp((popUp) => {
            return popUp === identifier ? null : identifier;
          });
        }}
      >
        {type === "clothes" && (
          <img
            src={require("./images/default_pet.gif")}
            alt={name}
            draggable="false"
            width="100%"
            style={{
              position: "absolute",
              left: `${offsetX}%`,
              top: `${offsetY}%`,
              width: `${width}%`,
              height: `${height}%`,
              opacity: 0.3,
              // zIndex: -1,
            }}
          />
        )}
        <img
          src={image}
          alt={name}
          draggable="false"
          width="100%"
          style={{
            position: "absolute",
            left: `${offsetX}%`,
            top: `${offsetY}%`,
            width: `${width}%`,
            height: `${height}%`,
            // zIndex: -1,
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {name}
        {showPrice && (
          <>
            <br />${cost}
          </>
        )}
      </div>
      {popUp === identifier && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "90%",
            background: "white",
            border: "1px solid grey",
            padding: 10,
            zIndex: 999,
            borderRadius: "0 6px 6px 0px",
            width: 150,
            boxShadow: "2px 2px 1px black",
          }}
        >
          {hp && (
            <>
              Recovers {hp} <Symbols.Health />
            </>
          )}
          {happiness && (
            <>
              Recovers {happiness} <Symbols.Happiness />
            </>
          )}
          {special?.coinSpawner && (
            <>
              <strong>When equipped:</strong> Spawns {special.coinSpawner}{" "}
              additional coin. <br />
            </>
          )}
          {special?.lucky && (
            <>
              <strong>When equipped:</strong> Increases chance of higher value
              coin. <br />
            </>
          )}
          {actions.map((action) => (
            <div
              name={action.id}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                onAction && onAction(action.id);
                setPopUp(null);
              }}
            >
              {action.text ? ">" : <br />} {action.text}
            </div>
          ))}
          <br />
          <div
            style={{
              color: "red",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              setPopUp(null);
            }}
          >
            [close]
          </div>
        </div>
      )}
    </div>
  );
}

export function ItemList({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}
