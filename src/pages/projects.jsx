import Page from "../components/page";
import { createPage } from "../app";

const projects = [
  {
    name: "last seen online",
    link: "https://gamejolt.com/games/djarlum/27466",
    date: null,
    description: <p>A top-down shooter made for #LOWREZJAM.</p>,
  },
  {
    name: "djarlum",
    link: "https://gamejolt.com/games/djarlum/27466",
    date: null,
    description: <p>A top-down shooter made for #LOWREZJAM.</p>,
  },
];

createPage(
  <>
    <h1>Projects</h1>
    {projects.map((project, idx) => (
      <div name="idx">
        <h2>{project.name} - <a target="_blank" href={project.link}>link</a></h2>
        <div>{project.description}</div>
      </div>
    ))}
  </>
);
