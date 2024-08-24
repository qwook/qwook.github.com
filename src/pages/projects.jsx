import Banner from "../components/Banner";
import Page from "../components/Page";
import aymiImage from "./images/aymi.png";
import { createPage } from "../app";

const projects = [
  {
    name: "last seen online",
    link: "https://store.steampowered.com/app/2824230/last_seen_online/",
    date: null,
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
    preview: aymiImage,
    description: (
      <p>
        An interactive installation about the unstoppable marching of time,
        digital nostalgia, and trauma. It uses a Gamecube controller to inflict
        anxiety.
      </p>
    ),
  },
  {
    name: "HTMLfest",
    link: "https://htmlfest.com/memories.html",
    description: (
      <p>
        A tiny festival of live performances and food in my backyard, with a
        focus on small artists of the weird wide web.
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
    link: [{ blog: "https://j-marx.com/the-circle" }],
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
  },
  {
    name: "Infinite Date",
    description: (
      <p>
        An infinite conversation between two chatbots who are anxiously and
        avoidantly attached.
      </p>
    ),
  },
  {
    name: "AI Loving Parents",
    description: (
      <p>
        Artificially generated creepy parents that tell you "I Love You" over
        and over again.
      </p>
    ),
  },
];

export default function ProjectsPage() {
  return (
    <div className="projects">
      <Banner>Projects</Banner>
      {projects.map((project, idx) => (
        <div key={idx} className="project">
          <h2>{project.name} </h2>
          <div className="project-body">
            <div className="project-description">
              {project.description}

              {project.link &&
                (() => {
                  if (project.link instanceof Array) {
                    return project.link.map((link, idx) => (
                      <a
                        key={idx}
                        target="_blank"
                        href={Object.values(link)[0]}
                      >
                        &gt; {Object.keys(link)[0]}
                      </a>
                    ));
                  } else {
                    return (
                      <a target="_blank" href={project.link}>
                        &gt; visit
                      </a>
                    );
                  }
                })()}
            </div>
            {project.preview && (
              <div className="project-preview">
                <img src={project.preview} alt="project preview" width="100%" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

createPage(ProjectsPage);
