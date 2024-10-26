import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSimpleTexture } from "../polaroids/Polaroid";
import { seededRandom } from "three/src/math/MathUtils.js";
import { DoubleSide, Vector3 } from "three";
import { numCrush, numDecrush } from "../../utils/numberCrusher";

const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
const maxDepth = 25;
// I did not program this thing with multiples of the year in mind...
// Instead it was pretty arbitrary.
const magicalLocalizer = 100000;

const PlantData = createContext({});
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function Node({ depth, branches, leaf, random = 0, ...props }) {
  let { progress } = useContext(PlantData);

  const stemMap = useSimpleTexture(require("./images/stem.gif"));
  const flowerMap = useSimpleTexture(require("../pets/images/flower.gif"));
  const leafMap = useSimpleTexture(require("./images/leaf.gif"));

  const flower = depth >= maxDepth;
  const seasonLength = millisecondsInYear / magicalLocalizer;
  progress /= magicalLocalizer;

  const objectRef = useRef();

  seededRandom(depth * 10000 + random * 10000);

  if (progress <= depth) {
    return <></>;
  }

  let length = progress > depth ? progress - depth : 0;
  let seasonProgress = 0;
  if (flower) {
    length =
      ((length * 0.1 + seasonLength / 2) % seasonLength) - seasonLength / 2;
    seasonProgress =
      ((progress - depth) * 0.1 + seasonLength / 2) % seasonLength;
  }
  if (leaf) length = length * 0.15 - 1;
  if (length < 0) {
    length = 0;
  }
  if (length > 1) {
    length = 1;
  }
  if (leaf) {
    length = easeOutCubic(length);
  }
  if (flower) {
    length = easeInOutCubic(length);
  }

  let spread = depth / 10;
  if (depth < maxDepth * 0.5) {
    spread /= 2;
  }
  if (leaf) {
    spread *= 10;
    length /= depth / 1.2;
  }

  let floor = (length == 0) & (progress > 0);

  // Increases probability that a child stem has an early death the higher the value.
  let earlyDeath = 5;
  // De-ages the stem. If not careful, a rogue plant can grow infinitely big.
  let immortality = 0;
  // If we are an old stem, perhaps our children can live longer?
  if (depth > maxDepth * 0.2) {
    earlyDeath = 10;
  }

  let flowerPos = [0, length / 2, 0];
  // Are we on the floor?
  if (flower && progress > depth && floor && objectRef.current) {
    const world = objectRef.current.localToWorld(new Vector3(...flowerPos));
    world.y = world.y - seasonProgress * 5;
    if (world.y <= -3) {
      world.y = -3;
    }
    flowerPos = objectRef.current.worldToLocal(world);
    length = 1;
  }

  return (
    <object3D
      {...props}
      ref={objectRef}
      rotation={[
        seededRandom() * spread - spread / 2,
        0,
        seededRandom() * spread - spread / 2,
      ]}
    >
      {leaf ? (
        <mesh
          scale={[length * 1, length * 10, 1]}
          position={[0, (length * 5) / 2, 0]}
          renderOrder={depth + 1000}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            transparent={true}
            map={leafMap}
            side={DoubleSide}
          />
        </mesh>
      ) : flower ? (
        <mesh scale={[length * 5, length * 5, 1]} position={flowerPos}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            transparent={true}
            map={flowerMap}
            side={DoubleSide}
          />
        </mesh>
      ) : (
        <>
          <mesh
            scale={[0.5, length, 1]}
            position={[0, length / 2, 0]}
            renderOrder={depth}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              map={stemMap}
              specular={0x995555}
              shininess={100}
              side={DoubleSide}
            />
          </mesh>
          <mesh
            scale={[0.5, length, 1]}
            position={[0, length / 2, 0]}
            rotation={[0, Math.PI, 0]}
            renderOrder={depth}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              map={stemMap}
              specular={0x995555}
              shininess={100}
              side={DoubleSide}
            />
          </mesh>
          <object3D position={[0, length, 0]}>
            {depth < maxDepth && (
              <Node depth={depth + 1} random={seededRandom()} />
            )}
            {((seededRandom() > 0.9 && depth > maxDepth * 0.3) ||
              (depth > 5 && Math.floor(depth * 10) % 20 === 0)) && (
              <Node depth={depth + seededRandom() * earlyDeath} />
            )}
            {seededRandom() > 0.6 && depth <= maxDepth * 0.3 && (
              <Node depth={depth + 1} leaf />
            )}
            {seededRandom() > 0.6 && depth <= maxDepth * 0.3 && (
              <Node depth={depth + 1} leaf />
            )}
            {seededRandom() > 0.3 && depth <= Math.ceil(maxDepth * 0.01) && (
              <Node depth={depth + 1} leaf />
            )}
            {seededRandom() > 0.2 && depth <= Math.ceil(maxDepth * 0.1) && (
              <Node depth={depth + 1} leaf />
            )}
          </object3D>
        </>
      )}
    </object3D>
  );
}

const epoch = 1729898825778;

export function plantTime() {
  return Date.now() - epoch;
}

const justBorn = numCrush(plantTime());

export default function Plant({ rate = 1, birthday = justBorn, now = 0 }) {
  const [progress, setProgress] = useState(0);
  const potBgMap = useSimpleTexture(require("./images/pot_back.gif"));
  const potFgMap = useSimpleTexture(require("./images/pot_fore.gif"));
  const buddhaMap = useSimpleTexture(require("./images/buddha.gif"));
  const lampMap = useSimpleTexture(require("./images/lamp.gif"));
  const mandarinsMap = useSimpleTexture(require("./images/mandarins.gif"));
  const candleMap = useSimpleTexture(require("./images/candle.gif"));
  const ricebowlMap = useSimpleTexture(require("./images/ricebowl.gif"));
  const birthdayNum = useMemo(() => {
    return numDecrush(birthday);
  }, [birthday]);

  seededRandom(birthdayNum);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((now - epoch - birthdayNum) * rate);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  /*
  
  root -> children

  node {
    type: stem

    branches: []
  }

  
  
  */

  return (
    // scale={[1.5, 1.5, 1.5]} position={[0, 1.8, 0]}
    <object3D>
      <PlantData.Provider value={{ progress }}>
        <ambientLight color={0xffffff} intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight
          position={[-5, -5, 5]}
          intensity={0.1}
          color="#ffffff"
        />
        <mesh scale={[2.5, 2.5, 2.5]} position={[0, -3.5, -1]} renderOrder={0}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={potBgMap} />
        </mesh>
        <Node depth={0} position={[0, -3, 0]} scale={[0.3, 0.3, 0.3]} />
        <mesh scale={[2, 2, 2]} position={[0, -2.3, 1]} renderOrder={2000}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={potFgMap} />
        </mesh>
        <mesh scale={[1.0, 1.0, 1.0]} position={[1, -2.4, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={buddhaMap} />
        </mesh>
        <mesh scale={[0.9, 0.9, 0.9]} position={[-0.6, -2.6, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={mandarinsMap} />
        </mesh>
        <mesh scale={[1.0, 1.0, 1.0]} position={[-1.5, -3.8, -1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={lampMap} />
        </mesh>
        <mesh scale={[0.5, 0.5, 0.5]} position={[-3.5, -4.1, -1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={candleMap} />
        </mesh>
        <mesh scale={[0.5, 0.5, 0.5]} position={[-3.1, -4.1, -1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={candleMap} />
        </mesh>
        <mesh scale={[0.5, 0.5, 0.5]} position={[-2.8, -4.2, -1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial transparent={true} map={ricebowlMap} />
        </mesh>
      </PlantData.Provider>
    </object3D>
  );
}
