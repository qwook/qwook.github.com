const map = {};

for (let i = 1; i <= 114; i++) {
  map[i] = require(`./images/${i}.gif`);
}

export function Smiley({ id, children }) {
  return id ? <img className="smiley" src={map[id]} /> : <div className="text-smiley">{children}</div>;
}
