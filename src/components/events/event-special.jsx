import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { useMemo } from "react";

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

  const calendarLink = useMemo(() => {
    const event = {
      title,
      hosts,
      description: window.location,
      start: startTime.getTime(),
      duration,
    };

    return {
      google: google(event),
      outlook: outlook(event),
      yahoo: yahoo(event),
    };
  });

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
                    backgroundImage: `url(${require("../../pages/events/htmlday2025/clock.gif")})`,
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
                    backgroundImage: `url(${require("../../pages/events/htmlday2025/at.gif")})`,
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
                    backgroundImage: `url(${require("../../pages/events/htmlday2025/world.gif")})`,
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
