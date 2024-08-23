import defaultImage from "./images/default.png"

export default function Pets() {
  return <>
    <img
      style={{
        width: 200
      }}
      src={defaultImage} alt="default pet" />
  </>
}