export const KEY_POINTS = [
  {
    entities: [
      {
        type: "path_zombie",
        path: [{ pos: [3.5, -1.5, -1] }, { pos: [3.5, -1.5, 4] }],
        position: [3.5, -1.5, -1],
        speed: 1,
      },
      {
        type: "path_zombie",
        path: [{ pos: [5, -1.5, -1] }, { pos: [4, -1.5, 4] }],
        position: [4, -1.5, -5],
        speed: 1,
      },
      {
        type: "path_zombie",
        path: [{ pos: [6, -1.5, -1] }, { pos: [6, -1.5, 3] }],
        position: [6, -1.5, -3],
        speed: 1,
      },
    ],
    track: [
      { position: [1, -2, 6], rotation: [0, -Math.PI / 2, 0], duration: 1 },
      { position: [4.5, -2, 5], rotation: [0, 0, 0], duration: 1 },
    ],
  },
  {
    // Only show 1 limb first and then 2 or 3.
    entities: [
      // { type: "throwing_zombie", position: [3, -1, 20] },
      { type: "throwing_zombie", position: [1.5, -1.5, 1] },
    ],
    track: [
      { position: [5, -2, 3], rotation: [0, 0, 0], duration: 0.5 },
      {
        position: [5, -2, -0.5],
        rotation: [0, 0, 0],
        duration: 0.75,
      },
      {
        position: [5, -2, -0.5],
        rotation: [0.1, Math.PI / 2 + 0.2, 0],
        duration: 1,
      },
    ],
  },
  {
    entities: [
      {
        type: "path_zombie",
        path: [
          { pos: [-0.5, -1.5, -4.5], speed: 2 },
          { pos: [1, -1.5, -4.5], speed: 0.5 },
        ],
        position: [-1, -1.5, -9],
        speed: 1,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [-5, -1.5, -4.5], speed: 3 },
          { pos: [1, -1.5, -3], speed: 2 },
          { speed: 2 },
        ],
        position: [-5, -1.5, -1.5],
        speed: 1,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [-9, -1.5, -6], speed: 3 },
          { pos: [1, -1.5, -4], speed: 1 },
          { speed: 1 },
        ],
        position: [-9, -1.5, -5],
        speed: 1,
      },
      // { type: "path_zombie", path:[{pos: [6, -1.5, -1]}, {pos: [6, -1.5, 3]}], position: [6, -1.5, -3], speed: 1 },
    ],
    track: [
      {
        position: [4, -2, -1],
        rotation: [0, Math.PI / 2 - 0.1, 0],
        duration: 0.5,
      },
      { position: [3, -2, -4], rotation: [0, Math.PI / 2, 0], duration: 1 },
    ],
  },
  {
    entities: [
      { type: "boss_zombie", position: [-5, -1.5, 6], speed: 0.5 },
      // { type: "zombie", position: [-2, 0, 10] },
      // { type: "zombie", position: [-6, 0, 15] },
      // { type: "zombie", position: [-15, 0, 9] },
      // { type: "zombie", position: [-20, 0, 9] },
    ],
    track: [
      { position: [-5, -2, -5], rotation: [0, Math.PI / 2, 0], duration: 2 },
      { position: [-5, -2, -5.5], rotation: [0.3, Math.PI, 0], duration: 0.5 },
    ],
  },
  {
    entities: [
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 5], speed: 7 },
          { pos: [-3, -1.5, 4.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 6], speed: 6 },
          { pos: [-3, -1.5, 6], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 7.5], speed: 8 },
          { pos: [-3, -1.5, 7.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      // Wave 2

      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 5], speed: 2.5 },
          { pos: [-3, -1.5, 4.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 6], speed: 1.8 },
          { pos: [-3, -1.5, 6], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 7.5], speed: 2 },
          { pos: [-3, -1.5, 7.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },

      // Wave 2

      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 5], speed: 1.4 },
          { pos: [-3, -1.5, 4.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 6], speed: 1.2 },
          { pos: [-3, -1.5, 6], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
      {
        type: "path_zombie",
        path: [
          { pos: [5, -1.5, 7.5], speed: 1.1 },
          { pos: [-3, -1.5, 7.5], speed: 3 },
        ],
        position: [5, -1.5, 1],
        speed: 5,
      },
    ],
    track: [
      { position: [-6, -2, 1], rotation: [0, Math.PI, 0], duration: 1 },
      {
        position: [-6, -2, 6.0],
        rotation: [0, -Math.PI / 2, 0],
        duration: 1,
      },
    ],
  },
];
