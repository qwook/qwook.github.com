import Player from "react-player";
import ClientOnly from "./ClientOnly";

/**
 * react-player renders different markup on the server than in the browser,
 * so it's mounted client-side only to keep prerendered pages hydrating.
 */
export default function ReactPlayer(props) {
  return (
    <ClientOnly>
      <Player {...props} />
    </ClientOnly>
  );
}
