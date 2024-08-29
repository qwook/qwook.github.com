import Age from "../../components/Age";
import Banner from "../../components/Banner";
import { createPage } from "../../app";

export default function Blogs_EnglishPage() {
  return (
    <div className="blog">
      <Banner>English Syntax Highlighting Test</Banner>
      <p>
        Here I experiment with ChatGPT 3.5 and seeing how well it can parse and
        highlight the English language.
      </p>
      <p>The prompt that I used to generate the following:</p>
      <p style={{ fontFamily: "monospace" }}>
        {`
        Syntax-highlight the following text using{" "}
        <span className="{type}">...</span> where {type} is noun, verb,
        adjective, conjunction, article, pronoun, adverb, possessive, preposition, article, and other word classifications. Give everything
        a classification.`}
      </p>
      <p>And now a couple fun tests.</p>
      <div className="english-syntax-highlight">
        <p>
          <span className="noun">Buffalo</span>{" "}
          <span className="noun">buffalo</span>{" "}
          <span className="noun">Buffalo</span>{" "}
          <span className="verb">buffalo</span>{" "}
          <span className="verb">buffalo</span>{" "}
          <span className="verb">buffalo</span>{" "}
          <span className="noun">Buffalo</span>{" "}
          <span className="verb">buffalo</span>.
        </p>
        <p>
          <span className="article">The</span>{" "}
          <span className="noun">horse</span>{" "}
          <span className="verb">raced</span>{" "}
          <span className="preposition">past</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">barn</span> <span className="verb">fell</span>.
        </p>
      </div>
      <p>
        In the following, it highlighted the sentence wrong and I needed to tell
        it to fix it. The two sentences imply different things. Though, it could
        be said that English is a confusing language and both versions are
        correctly interpreted.
      </p>
      <div className="english-syntax-highlight">
        <p>
          <span className="noun">Time</span> <span className="verb">flies</span>{" "}
          <span className="preposition">like</span>{" "}
          <span className="article">an</span>{" "}
          <span className="noun">arrow</span>;{" "}
          <span className="noun">fruit</span>{" "}
          <span className="verb">flies</span>{" "}
          <span className="preposition">like</span>{" "}
          <span className="article">a</span>{" "}
          <span className="noun">banana</span>.
        </p>
        <p>
          <span className="noun">Time</span> <span className="verb">flies</span>{" "}
          <span className="preposition">like</span>{" "}
          <span className="article">an</span>{" "}
          <span className="noun">arrow</span>;{" "}
          <span className="noun">fruit flies</span>{" "}
          <span className="verb">like</span>{" "}
          <span className="noun">a banana</span>.
        </p>
      </div>
      <p>A couple more fun ones:</p>
      <div className="english-syntax-highlight">
        <p>
          <span className="verb">Can</span> <span className="pronoun">you</span>{" "}
          <span className="verb">can</span> <span className="article">a</span>{" "}
          <span className="noun">can</span>{" "}
          <span className="preposition">as</span>{" "}
          <span className="article">a</span>{" "}
          <span className="noun">canner</span> <span className="verb">can</span>{" "}
          <span className="verb">can</span> <span className="article">a</span>{" "}
          <span className="noun">can</span>?
        </p>
        <p>
          <span className="pronoun">That</span>{" "}
          <span className="pronoun">that</span> <span className="verb">is</span>{" "}
          <span className="verb">is</span> <span className="pronoun">that</span>{" "}
          <span className="pronoun">that</span> <span className="verb">is</span>{" "}
          <span className="adverb">not</span> <span className="verb">is</span>{" "}
          <span className="adverb">not</span> <span className="verb">is</span>{" "}
          <span className="pronoun">that</span>{" "}
          <span className="pronoun">it</span>{" "}
          <span className="pronoun">it</span> <span className="verb">is</span>.
        </p>
      </div>
      <p>Excerpt from my own writing:</p>
      <div className="english-syntax-highlight">
        <p>
          <span className="article">The</span>{" "}
          <span className="noun">SJSU</span>{" "}
          <span className="noun">Production</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">The</span>{" "}
          <span className="noun">Circle</span>{" "}
          <span className="verb">allowed</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">audience</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="verb">roam</span>{" "}
          <span className="preposition">around</span>{" "}
          <span className="article">a</span>{" "}
          <span className="noun">building</span>{" "}
          <span className="conjunction">and</span>{" "}
          <span className="verb">interact</span>{" "}
          <span className="preposition">with</span>{" "}
          <span className="noun">actors</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">play</span>.{" "}
          <span className="article">The</span>{" "}
          <span className="noun">audience</span>{" "}
          <span className="verb">could</span>{" "}
          <span className="verb">choose</span>{" "}
          <span className="possessive">their</span>{" "}
          <span className="adjective">own</span>{" "}
          <span className="noun">adventure</span>{" "}
          <span className="conjunction">and</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="verb">see</span>{" "}
          <span className="adjective">different</span>{" "}
          <span className="noun">sides</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">story</span>.
        </p>
        <p>
          <span className="preposition">Due</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">scale</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">play</span>,{" "}
          <span className="noun">actors</span>{" "}
          <span className="verb">would</span>{" "}
          <span className="adverb">not</span> <span className="verb">be</span>{" "}
          <span className="verb">able</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="verb">keep</span> <span className="verb">track</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">all</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">players</span>{" "}
          <span className="conjunction">and</span>{" "}
          <span className="verb">send</span>{" "}
          <span className="noun">messages</span>{" "}
          <span className="conjunction">or</span>{" "}
          <span className="verb">give</span>{" "}
          <span className="noun">points</span>{" "}
          <span className="adverb">manually</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="pronoun">them</span>.
        </p>
        <p>
          <span className="article">The</span>{" "}
          <span className="noun">purpose</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">The</span>{" "}
          <span className="noun">Circle</span> <span className="noun">App</span>{" "}
          <span className="verb">was</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="verb">monitor</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">position</span>{" "}
          <span className="preposition">of</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">user</span>{" "}
          <span className="preposition">as</span>{" "}
          <span className="pronoun">they</span>{" "}
          <span className="verb">traversed</span>{" "}
          <span className="preposition">through</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">building</span>.{" "}
          <span className="adjective">Automatic</span>{" "}
          <span className="adjective">push</span>{" "}
          <span className="noun">notifications</span>{" "}
          <span className="verb">were</span> <span className="verb">sent</span>{" "}
          <span className="preposition">to</span>{" "}
          <span className="noun">users</span>{" "}
          <span className="conjunction">if</span>{" "}
          <span className="pronoun">they</span>{" "}
          <span className="verb">were</span>{" "}
          <span className="preposition">in</span>{" "}
          <span className="article">a</span>{" "}
          <span className="adjective">certain</span>{" "}
          <span className="noun">room</span>{" "}
          <span className="preposition">during</span>{" "}
          <span className="article">an</span>{" "}
          <span className="noun">event</span>,{" "}
          <span className="verb">giving</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">user</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">illusion</span>{" "}
          <span className="conjunction">that</span>{" "}
          <span className="pronoun">they</span>{" "}
          <span className="verb">were</span> <span className="verb">being</span>{" "}
          <span className="verb">messaged</span>{" "}
          <span className="conjunction">and</span>{" "}
          <span className="verb">given</span>{" "}
          <span className="noun">points</span>{" "}
          <span className="preposition">by</span>{" "}
          <span className="article">the</span>{" "}
          <span className="noun">actors</span>.
        </p>
      </div>
    </div>
  );
}

createPage(Blogs_EnglishPage);
