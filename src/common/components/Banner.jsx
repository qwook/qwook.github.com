function stringToHue(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = (hash << 5) - hash + string.charCodeAt(i) * 10;
    hash |= 0; // Convert to 32-bit integer
  }

  // Map the integer to the range [0, 360] for hue
  const hue = Math.abs(hash) % 360;

  return hue;
}

export default function Banner({ children }) {
  return (
    <h1
      className="banner"
      style={{
        backgroundColor: `hsl(${stringToHue(children.toString())} 50% 50%)`,
      }}
    >
      <div className="banner-background-text">{children}</div>
      <div className="banner-foreground-text">{children}</div>
    </h1>
  );
}
