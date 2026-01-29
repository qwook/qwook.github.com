import Banner from "../components/Banner";
import Page from "../components/Page";
import { createPage } from "../app";

// Imagine being so lazy that you make a component for this.
function OuterLink({ href, children }) {
  return (
    <li>
      <a target="_blank" href={href}>
        {children}
      </a>
    </li>
  );
}

export default function ListPage() {
  return (
    <>
      <Banner>Random List of Things</Banner>
      <h1>Blogs</h1>
      <ul>
        <OuterLink href="https://www.blog.radiator.debacle.us/search/label/design%20rant">
          Robert Yang's Design Rants
        </OuterLink>
        <OuterLink href="http://www.lumpley.com/">Lumpley</OuterLink>
        <OuterLink href="https://factorio.com/blog/search/c++">
          Factorio
        </OuterLink>
        <OuterLink href="https://garry.net/posts">Garry's Blog</OuterLink>
        <OuterLink href="https://jvns.ca/blog/brag-documents/">
          Julia Evans on Brag Docs
        </OuterLink>
      </ul>
      <h1>Game Design</h1>
      <ul>
        <OuterLink href="https://www.youtube.com/watch?v=c91IWh4agzU">
          Will Wright's Design Plunder (With Slides)
        </OuterLink>
        <li>
          <a
            target="_blank"
            href="https://gameprogrammingpatterns.com/contents.html"
          >
            Game Programming Patterns
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking"
          >
            Source Multiplayer Networking
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Fast_inverse_square_root"
          >
            False inverse square root
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=Fy0aCDmgnxg">
            Juice it or lose it - a talk by Martin Jonasson & Petri Purho
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.derekyu.com/makegames/pixelart.html"
          >
            PIXEL ART TUTORIAL: BASICS
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=PUv66718DII">
            Bret Victor - Inventing on Principle
          </a>
        </li>
      </ul>
      <h1>Random</h1>
      <ul>
        <li>
          <a target="_blank" href="https://humanshader.com/">
            Human-calculated shader / rendering!!
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=wupToqz1e2g">
            Carl Sagan - Pale Blue Dot
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=xg29TuWo0Yo">
            Live Forever As You Are Now With Alan Resnick
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=2gMjJNGg9Z8">
            Unedited Footage of a Bear
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=xyvu5QTbPkk">
            Pirate Baby's Cabana Battle Street Fight 2006
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=IXIyB5XoHVk">
            Derren Brown: An Evening of Wonders (Full)
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.youtube.com/watch?v=zLNaaFw51O0">
            ARM tutorial
          </a>
        </li>
      </ul>
    </>
  );
}

createPage(ListPage);
