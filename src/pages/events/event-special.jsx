import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { useEffect, useMemo, useState } from "react";
import clock from "./htmlday2025/clock.gif";
import at from "./htmlday2025/at.gif";
import world from "./htmlday2025/world.gif";

export function EventSpecial({
  title,
  titleHtml,
  hosts,
  start,
  location,
  description,
  children,
  duration,
  language,
  setLanguage,
}) {
  const startTime = useMemo(() => new Date(start), [start]);
  const endTime = useMemo(() => {
    if (duration[1] === "hour") {
      return new Date(startTime.getTime() + 60 * 60 * 1000 * duration[0]);
    } else if (duration[1] === "minute") {
      return new Date(startTime.getTime() + 60 * 1000 * duration[0]);
    }
    return new Date(startTime.getTime());
  }, [startTime, ...duration]);

  // Built after mount: it needs window.location, and the timestamps depend
  // on the viewer's timezone, so a prerendered href would be wrong.
  const [calendarLink, setCalendarLink] = useState({});
  useEffect(() => {
    const event = {
      title,
      hosts,
      description: window.location.href,
      start: startTime.getTime(),
      duration,
    };

    setCalendarLink({
      google: google(event),
      outlook: outlook(event),
      yahoo: yahoo(event),
    });
  }, [title, startTime]);

  return (
    <>
      <div className="event">
        <h1>{titleHtml}</h1>
        <p>
          [
          <div
            className={[
              "language",
              "fake-link",
              language === "vn" ? "selected" : "",
            ].join(" ")}
            onClick={(e) => setLanguage("vn")}
          >
            Tiếng Việt
          </div>
          {" / "}
          <div
            className={[
              "language",
              "fake-link",
              language === "en" ? "selected" : "",
            ].join(" ")}
            onClick={(e) => setLanguage("en")}
          >
            English
          </div>
          ]
        </p>
        {hosts && (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="row">
                <div
                  className="icon"
                  style={{
                    backgroundImage: `url(${clock})`,
                  }}
                />
                <div style={{flexGrow: 1}}>
                  <a href={calendarLink.google} target="_blank">
                    {language === "vn"
                      ? [
                          "Chủ Nhật",
                          "Thứ Hai",
                          "Thứ Ba",
                          "Thứ Bốn",
                          "Thứ Năm",
                          "Thứ Sáu",
                          "Thứ Bảy",
                        ][startTime.getDay()]
                      : [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][startTime.getDay()]}
                    <br />
                    {startTime.getDate()}/{startTime.getMonth() + 1}/
                    {startTime.getFullYear() % 100}{" "}
                    {startTime.getHours() < 10 && "0"}
                    {startTime.getHours()}h{startTime.getMinutes() < 10 && "0"}
                    {startTime.getMinutes()} - {endTime.getHours()}h
                    {endTime.getMinutes() < 10 && "0"}
                    {endTime.getMinutes()}
                  </a>
                </div>
              </div>
              <div className="row">
                <div
                  className="icon"
                  style={{
                    backgroundImage: `url(${at})`,
                  }}
                />
                <div style={{flexGrow: 1}}>
                  {language === "vn" ? "Sự kiện được host bởi " : "Hosted by "}
                  {hosts.map((host, idx) => {
                    return (
                      <>
                        <a href={host.url} target="_blank">
                          {host.name}
                        </a>
                        {idx !== hosts.length - 1
                          ? language === "vn"
                            ? " và "
                            : " and "
                          : ""}
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="row">
                <div
                  className="icon"
                  style={{
                    backgroundImage: `url(${world})`,
                  }}
                />
                <div>{location.address}</div>
              </div>
            </div>
          </>
        )}
        <br />
        <br />
        {children}{" "}
      </div>
    </>
  );
}
