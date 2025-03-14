export function FlashCardImage({ image, children }) {
  return (
    <>
      {children}
      <br />
      <img src={image} />
    </>
  );
}
