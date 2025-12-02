import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Page from "../components/Page";
import { createPage } from "../app";
import HTMLFestCarousel from "../components/HTMLFestCarousel";

const works = [
  {
    name: "last seen online",
    link: "/lso",
    preview: require("./images/lso.png"),
    description: (
      <p>
        A psychological horror game about exploring a teenage girl's abandoned
        computer.
      </p>
    ),
  },
  {
    name: "And You'll Miss It",
    link: [{ instagram: "https://www.instagram.com/p/C-TKj2JSPTr/" }],
    preview: require("./images/aymi.png"),
    description: (
      <p>
        An interactive installation about the unstoppable marching of time,
        digital nostalgia, and trauma. It uses a Gamecube controller to inflict
        anxiety.
      </p>
    ),
  },
  {
    name: "Chào Tạm Biệt (2024)",
    link: "/blogs/chao",
    preview: (
      <Carousel>
        <img src={require("./blogs/chao/IMG_1651.jpg")} alt="project preview" />
        <img src={require("./blogs/chao/IMG_1682.jpg")} alt="project preview" />
        <img src={require("./blogs/chao/IMG_1009.jpg")} alt="project preview" />
        <img
          src={require("./blogs/chao/chao_tam_biet_poster.jpg")}
          alt="project preview"
        />
      </Carousel>
    ),
    description: (
      <p>An backyard show I threw when I said goodbye to San Francisco.</p>
    ),
  },
  {
    name: "HTMLfest",
    link: "https://htmlfest.com/memories.html",
    preview: <HTMLFestCarousel />,
    description: (
      <p>
        A tiny festival of live performances and food in my backyard, with a
        focus on small artists of the weird wide web.
      </p>
    ),
  },
  {
    name: "Durians and the Monsters We Face",
    link: "/blogs/durians",
    description: (
      <p>
        A short story about a Vietnamese grandmother making an unexpected friend
        on the BART. Winner of the 2022 BART Lines Short Story competition.
      </p>
    ),
  },
  {
    name: "The Circle - Immersive Theater",
    description: (
      <p>
        Will Simons and I created the mobile app for a live interactive
        experience at San Jose State Universe.
      </p>
    ),
    link: [
      { blog: "/blogs/circle", internal: true },
      { "external blog": "https://j-marx.com/the-circle" },
    ],
    preview: require("./blogs/circle/preview.png"),
  },
  {
    name: "Henry's Animation Tool",
    link: "https://steamcommunity.com/sharedfiles/filedetails/?id=111364507",
    description: (
      <p>
        An add-on for Garry's Mod to animate ragdolls and props. Made this in
        high-school. The first time I ever went viral :)
      </p>
    ),
  },
  {
    name: "Arcade Cabinet Launcher",
    description: (
      <p>
        Software used to launch and monitor games for SJSU Game Dev's arcade
        cabinets.
      </p>
    ),
    link: [{ blog: "/blogs/arcade", internal: true }],
    preview: require("./blogs/arcade/arcadelauncher.gif"),
  },
  {
    name: "Supportive Parents",
    description: <p>Artificially generated parents that will support you.</p>,
    link: [{ "watch video": "/blogs/parents", internal: true }],
    preview: require("./blogs/parents/preview.png"),
  },
];

export default function WorksPage() {
  return (
    <div className="projects">
      <Banner>Works</Banner>
      {works.map((project, idx) => (
        <div key={idx} className="project">
          <h2>{project.name} </h2>
          <div className="project-body">
            <div className="project-description">{project.description}</div>
            {project.preview &&
              (() => {
                if (typeof project.preview === "string") {
                  return (
                    <div className="project-preview">
                      <img
                        src={project.preview}
                        alt="project preview"
                        width="100%"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="project-preview">{project.preview}</div>
                  );
                }
              })()}
          </div>
          <div className="project-links">
            {project.link &&
              (() => {
                if (project.link instanceof Array) {
                  return project.link.map((link, idx) => {
                    const internal = link.internal;
                    delete link.internal;
                    return (
                      <a
                        className="project-link"
                        key={idx}
                        target={internal ? null : "_blank"}
                        href={Object.values(link)[0]}
                      >
                        {Object.keys(link)[0]}
                      </a>
                    );
                  });
                } else {
                  return (
                    <a
                      className="project-link"
                      target="_blank"
                      href={project.link}
                    >
                      visit
                    </a>
                  );
                }
              })()}
          </div>
        </div>
      ))}
    </div>
  );
}

createPage(WorksPage);
