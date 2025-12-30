import { headTags } from "./utils/headTags";

headTags({
  title: "Henry Quoc Tran's Homepage!",
  image: require("./pages/images/furcadia.gif"),
  description: "Here is my existence on the world wide web.",
});

import Age from "./components/Age";
import Banner from "./components/Banner";
import WebRing from "./components/webring/WebRing";
import { createPage } from "./app";
import { Collapsible } from "./components/ui/Collapsible";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Smiley } from "./components/smiley/Smiley";

export default function IndexPage() {
  const [showCode, setShowCode] = useState(false);
  const [showCodeToggle, setShowCodeToggle] = useState(false);

  return (
    <div>
      <Banner>Welcome to qwook.io</Banner>
      <p>
        My name is Henry <a href="/blogs/name">Quoc</a> Tran. I am currently{" "}
        <Age /> years old. I grew up in Milpitas, California. I live in Saigon,
        Vietnam. Previously: San Francisco, California. I like to{" "}
        <a href="/blogs/dev">develop games!</a> I am{" "}
        <a href="/blogs/lasan">Vietnamese</a> and Chinese. I live life through{" "}
        <a href="/quests">quests.</a> <Smiley id={48} />
      </p>
      <p>
        Currently, I am in Saigon focused on learning{" "}
        <a href="/flashcards">Vietnamese</a> and{" "}
        <a href="/games/invite">hosting</a>{" events and "}
        <a href="/events/movie2">movie nights</a>. Recently I made a translation
        of the <a href="/vinawolf">One Night Ultimate Werewolf</a> app in
        Vietnamese!
      </p>
      <p>
        I love magic, one of my heroes is Derren Brown.{" "}
        <a href="/astrology">Click here to get your digital palm read!</a>
      </p>
      <p>
        I have a habit of scrolling endlessly through old Geocities pages –
        remnants of the old internet. Or stalking people{" "}
        <a
          target="_blank"
          href="https://web.archive.org/web/19961227151809/http://www.ualberta.ca:80/~jnguyen/vietfun.html"
        >
          20 years older
        </a>{" "}
        than me, who I used to play games and learn how to program with. I find
        it interesting how I am now their age when they first talked to me. Most
        of them disappeared off the internet. I wonder what happened, and I
        wonder if I'll also, one day, disappear.
      </p>
      <p
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => {
          setShowCode(true);
        }}
        onMouseLeave={() => {
          setShowCode(false);
        }}
        onClick={() => {
          setShowCodeToggle((toggle) => !toggle);
        }}
      >
        <img
          style={{
            maxWidth: "100%",
            width: 400,
          }}
          alt="me"
          src={require("./pages/images/output.gif")}
        ></img>
        <div
          style={{
            display: showCode || showCodeToggle ? "block" : "none",
            fontSize: 12,
            maxWidth: "100%",
            width: 400,
            height: 200,
            position: "absolute",
            top: 0,
            left: 0,
            overflowY: "scroll",
            // background: "white",
          }}
        >
          <SyntaxHighlighter language="javascript" style={docco}>
            {`
//
//  main.cpp
//  VisionTest
//
//  Created by hen on 8/14/14.
//  Copyright (c) 2014 qwook. All rights reserved.
//

#include <iostream>

#include <opencv2/opencv.hpp>

#include <zlib.h>

using namespace cv;
using namespace std;

int main(int argc, const char * argv[])
{
    VideoCapture cam(0);
    
    Mat frameOriginal;
    
    Mat saved;
    
    Mat previous;
    Mat frame;
    Mat flow;
//    SIFT extractor;
    
    char key;
    bool first = true;
    
    while (true) {
        
        cam >> frameOriginal;
        resize(frameOriginal, frame, Size(frameOriginal.cols/2, frameOriginal.rows/2));
        
        if (key == 'q') break;
        if (key == 'c' or first) {
            first = false;
            frame.copyTo(saved);
//            resize(frame, saved, Size(frame.cols/4, frame.rows/4));
        }
        if (key == 'a') {
            
            if (!previous.empty()) {
                Mat previousGrey;
                cvtColor(previous, previousGrey, COLOR_BGR2GRAY);
                
                Mat frameGrey;
                cvtColor(frame, frameGrey, COLOR_BGR2GRAY);
                
//                calcOpticalFlowFarneback(previousGrey, frameGrey, flow, 0.5f, 3, 15, 3, 5, 1.2, OPTFLOW_FARNEBACK_GAUSSIAN);
                calcOpticalFlowFarneback(previousGrey, frameGrey, flow, 0.5f, 3, 15, 3, 5, 1.2, 0);
            }
            
            frame.copyTo(previous);
            
            const int rows = flow.rows;
            const int cols = flow.cols;
            
            const int saved_rows = saved.rows;
            const int saved_cols = saved.cols;
            
            Mat oldSaved;
            saved.copyTo(oldSaved);
            
            for (int y = 0; y < rows; y+=1) {
                for (int x = 0; x < cols; x+=1) {
                    Vec2f flowVec = flow.at<Vec2f>(y, x);
//                    line(saved, Point2f(x + flowVec[0], y + flowVec[1]), Point2f(x + flowVec[0], y + flowVec[1]), Scalar(255, 0, 0));
                    Vec3b pixel = oldSaved.at<Vec3b>(y, x);
                    saved.at<Vec3b>((int)MAX(MIN(round((y + flowVec[1])), saved_rows-1), 0), (int)MAX(MIN(round((x + flowVec[0])), saved_cols-1), 0)) = pixel;
                    
//                    saved.at<Vec3b>(y, x) = Vec3b(flowVec[0]*127, flowVec[1]*127, flowVec[0]*127);
                    
                }
            }
        }
        
        key = waitKey(1);
        
        imshow("window", saved);

        
    }

    return 0;
}


`}
          </SyntaxHighlighter>
        </div>
      </p>
      <p>
        I like to explore nostalgia, <a href="/anxiety">trauma</a>, and the{" "}
        <a href="/decompose">deterioration of the internet.</a> I also like
        happy things too like matcha mochi donuts. <Smiley id={103} />
      </p>
      <p>
        <Collapsible name="Also, I guess I am a bunch of other stuff...">
          <p>
            I am an{" "}
            <a href="https://lastseenonline.com">indie game developer</a>.
          </p>
          <p>
            I am an{" "}
            <a href="https://instagram.com/nohurryhen">
              Instagram stories spammer
            </a>
            .
          </p>
          <p>
            I am a <a href="https://substack.com/@henrytran">writer</a> and I've
            won <a href="/blogs/durians">an award</a>.
          </p>
          <p>I am a web developer.</p>
          <p>
            I produce electronic{" "}
            <a href="https://soundcloud.com/kid64">music</a>.
          </p>
          <p>
            I host <a href="/chao">events</a>.
          </p>
          <p>
            I compose and write{" "}
            <a href="https://soundcloud.com/hernry">lyrics</a>.
          </p>
          <p>
            I sometimes <a href="/art">draw</a>.
          </p>
          <p>
            I ride{" "}
            <a href="https://www.instagram.com/p/C_KNpXwRCf1">motorcycles</a>.
          </p>
          <p>I do vinyasa yoga.</p>
          <p>I boulder and top-rope.</p>
        </Collapsible>
      </p>
      <a href="https://www.youtube.com/watch?v=6YMJm-_sivE" target="_new">
        <img
          style={{
            maxWidth: "100%",
            width: 400,
          }}
          src={require("./pages/images/furcadia.gif")}
          alt="furcadia"
        />
      </a>
      <hr />
      <p>
        These are links to some cool people that I added without their
        permission. Please message me if you want your link removed.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <WebRing
          text={"violand"}
          image={
            "https://freight.cargo.site/t/original/i/00ad0e84c5db1b13ee35f3592172653b13393a6076fb5ee57ac3274f4cf7e1b8/yolk.ico"
          }
          link={"https://violand.xyz/"}
        />
        <WebRing
          text={"empowa"}
          image={"https://ashleyherr.com/favicon.ico"}
          link={"https://ashleyherr.com"}
        />
        <WebRing
          text={"dan dog"}
          image={"https://dan.dog/doggo.gif"}
          link={"https://dan.dog/"}
        />
        <WebRing
          text={"･ﾟ✧ chia"}
          image={"https://chia.design/favicon.ico"}
          link={"https://chia.design"}
        />
        <WebRing
          text={"kevin's garden"}
          image={"https://kevin.garden/favicon.png"}
          link={"https://kevin.garden"}
        />
        <WebRing
          text={"leia"}
          image={"https://leiac.me/favicon.ico"}
          link={"https://leiac.me/"}
        />
        <WebRing
          text={"isabel li"}
          image={"https://isabel.li/assets/YUE.png"}
          link={"https://isabel.li/"}
        />
        <WebRing
          text={"weird salmon"}
          image={"https://simons.dev/static/icon.png"}
          link={"https://simons.dev/"}
        />
        <WebRing
          text={"SHARON"}
          image={"https://sharonzheng.com/favicon.ico"}
          link={"https://sharonzheng.com/"}
        />
        <WebRing
          text={"anthony tesija"}
          image={"https://anthonytesija.com/static/media/face.00003743.png"}
          link={"https://anthonytesija.com/"}
        />
        <WebRing text={"t.i.a.t."} link={"https://tiat.place/"} />
      </div>
    </div>
  );
}

createPage(IndexPage);
