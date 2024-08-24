import { useContext, useState } from "react";

import { PetsContext } from "./PetsContext";

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
}) {
  const identifier = `${type}-${id}-${uuid}`;
  const { popUp, setPopUp, equipped } = useContext(PetsContext);
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
        }}
        onClick={(e) => {
          setPopUp((popUp) => {
            return popUp === identifier ? null : identifier;
          });
        }}
      >
        <img src={image} alt={name} draggable="false" width="100%" />
      </div>
      <div
        style={{
          width: "100%",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {name}
        <br />${cost}
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
          {hp && <>Recovers {hp} health.</>}
          {happiness && <>Recovers {happiness} happiness.</>}
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
