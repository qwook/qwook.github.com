import { createPage } from "../../app";
import * as _ from "lodash";
import Banner from "../../components/Banner";
import { Children, useState } from "react";

function Story({ children }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <img
        src={require("./images/story.png")}
        style={{ height: "1em" }}
        onClick={(e) => {
          setShow(!show);
        }}
      />
      {show && (
        <ul>
          <li>{children}</li>
        </ul>
      )}
    </>
  );
}

export default function Page() {
  return (
    <div>
      <Banner>Learning Vietnam Flashcards</Banner>
      <p>These are little apps I made to help me learn Vietnamese.</p>
      <p>
        Click on{" "}
        <img src={require("./images/story.png")} style={{ height: "1em" }} />{" "}
        for fun stories.
      </p>
      <h2>Flashcards</h2>
      <ul>
        <li>
          <a href="/flashcards/misc">Misc</a>
        </li>
        <li>
          <a href="/flashcards/tet">Tết and Family</a>
        </li>
        <li>
          <a href="/flashcards/flavor-text">
            Flavor Text - Text to emphasize or to add quirkiness.
          </a>
        </li>
        <li>
          <a href="/flashcards/descriptors">Descriptors</a>
          <Story>
            I heard my cousin calling himself "lười" when he felt like he didn't
            want to go out. I asked him what it meant. I learned about "sến"
            from musicians about certain music. The Vietnamese girl I am dating
            calls me "sến" all the time.
          </Story>
        </li>
        <li>
          <a href="/flashcards/feeling">Feeling</a>
          <Story>
            3/2/2025 - I was having conflict with other people and struggled to
            communicate how I was feeling to my Vietnamese teacher.
          </Story>
        </li>
        <li>
          <a href="/flashcards/sick">Sick</a>
          <Story>
            30/1/2025 - I got really sick while staying at my aunt and uncle's
            house on Tet. I needed to communicate how I was feeling and what
            symptoms I had.
          </Story>
        </li>
        <li>
          <a href="/flashcards/colors">Colors</a>
          <Story>
            3/2/2025 - My cousin called out that I say, "blue of the sky" when
            everyone here says, "blue of the ocean." This triggered me to look
            up what all the colors were. This has helped me for rock climbing
            and communicating routes.
          </Story>
        </li>
        <li>
          <a href="/flashcards/directions">Directions</a>
          <Story>
            24/1/2025 - One of my friends Chuong / @banhmicowboy used "hướng" to
            explain the rules of the "Vroom" game in King's Cup. That night, I
            mixed up "left" and "right" accents and said "trải" and "phài". My
            grab driver corrected me. This was when I first met my friends Jodi
            and Mess.
          </Story>
        </li>
        <li>
          <a href="/flashcards/temporal">Temporal</a>
          <Story>
            People keep asking me how long I am staying in Vietnam for and how
            long I've been here, and I keep forgetting how to tell them.
          </Story>
        </li>
        <li>
          <a href="/flashcards/weekdays">Weekdays</a>
        </li>
        <li>
          <a href="/flashcards/core">Core words</a>
        </li>
        <li>
          <a href="/flashcards/sinhto">Sinh Tố / Smoothie Flavors</a>
          <Story>
            7/12/2024 - My mom told me to order her favorite Sinh Tố flavor,
            Mãng Cầu. I got lost in the Sinh Tố menu, and I figure I need to
            learn the name of fruits. Especially fruits used in smoothies.
          </Story>
        </li>
        <li>
          <a href="/flashcards/pho">Phở Options</a>
          <Story>
            1/2/2025 - Since I landed in Vietnam, I only ordered Phở Tái since
            it was the only one I remembered. Recently, I met Khuế and Vui Quá
            and they brought us to a late-night phở place after volleyball. I
            tried Phở Thập Cẩm aka "mixed" and I realized I wanted the other
            meats.
          </Story>
        </li>
        <li>
          <a href="/flashcards/jobs">Jobs (need to be double-checked)</a>
        </li>
        <li>
          <a href="/flashcards/sauces">Sauces (need to be double-checked)</a>
          <Story>
            I keep asking restaurant owners to help me make the sauces for
            foods. They are so eager to help though! I'll need to create a
            flashcard of sauce mixtures and their dish pairings some time.
          </Story>
        </li>
        <li>
          <a href="/flashcards/alphabet">
            Alphabet (need to be double-checked)
          </a>
          <Story>
            On April 2024, I arrived in Hanoi and did not know the difference
            between "o" and "ô" and "ơ". All the street names start with "Phố"
            and I was wondering why every street was Vietnamese noodles. Took me
            a while for me to learn "Phố" means "Street" and is different from
            "Phở."
          </Story>
        </li>
        <li>
          <a href="/flashcards/symbols">
            Math and Address Symbols (/ @ . - +) (need to be double-checked)
          </a>
        </li>
        <li>
          <a href="/flashcards/math">Math Symbols Only</a>
          <Story>
            1/3/2025 - I've been playing boardgames with Tú Vinh, Chanh and
            Phương. The specific boardgame we played, Eldritch Horror, required
            math when calculating combat and skill tests.
          </Story>
        </li>
        <li>
          <a href="/flashcards/fried-chicken">Fried Chicken (Chicken Cuts)</a>
          <Story>
            14/3/2025 - I went out to order fried chicken today. I did not know
            any of the chicken parts when looking at the menu, so I showed them
            a picture. How embarassing.
          </Story>
        </li>
      </ul>
      <h2>Doraemon Flashcards</h2>
      <p>
        I've been reading Doraemon and have been writing down words I don't
        recognize. Since there's no categorization, I've put them into sets of
        10.
      </p>
      <ol>
        <li>
          <a href="/flashcards/doraemon/1">Doraemon appears with a warning.</a>
        </li>
        <li>Great-grandson explains.</li>
        <li>
          <a href="/flashcards/doraemon/3">Accidents are happening.</a>
        </li>
      </ol>
      <h2>Audio Flashcards</h2>
      <ul>
        <li>
          <a href="/flashcards/audio">Vowels and Tones</a>
        </li>
      </ul>
    </div>
  );
}

createPage(Page, { showPets: false, showNav: true });
