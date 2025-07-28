import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { useMemo } from "react";

import "./event-special.scss";

export function EventSpecial({
  title,
  titleHtml,
  hosts,
  start,
  location,
  description,
  children,
  duration,
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
        {hosts && (
          <>
            <div
              className="icon"
              style={{
                backgroundImage: `url(${require("../../pages/events/htmlday2025/clock.gif")})`,
              }}
            />
            <div style={{ display: "inline-block", verticalAlign: "top" }}>
              <a href={calendarLink.google} target="_blank">
                {
                  [
                    "Chủ Nhật",
                    "Thứ Hai",
                    "Thứ Ba",
                    "Thứ Bốn",
                    "Thứ Năm",
                    "Thứ Sáu",
                    "Thứ Bảy",
                  ][startTime.getDay()]
                }
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
            <br />
            <div
              className="icon"
              style={{
                backgroundImage: `url(${require("../../pages/events/htmlday2025/at.gif")})`,
              }}
            />
            <div style={{ display: "inline-block", verticalAlign: "top" }}>
              Hosted by{" "}
              {hosts.map((host, idx) => {
                return (
                  <>
                    <a href={host.url} target="_blank">
                      {host.name}
                    </a>
                    {idx !== hosts.length - 1 ? " and " : ""}
                  </>
                );
              })}
            </div>
            <br />
            <div
              className="icon"
              style={{
                backgroundImage: `url(${require("../../pages/events/htmlday2025/world.gif")})`,
              }}
            />
            <div style={{ display: "inline-block", verticalAlign: "top" }}>
              {location.address}
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
