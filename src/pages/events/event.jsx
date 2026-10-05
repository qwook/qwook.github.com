import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { useEffect, useMemo, useState } from "react";

import "./event.css";

export function Event({
  title,
  host,
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

  // Built after mount: it needs window.location, and the timestamps depend
  // on the viewer's timezone, so a prerendered href would be wrong.
  const [calendarLink, setCalendarLink] = useState({});
  useEffect(() => {
    const event = {
      title,
      host,
      description: window.location.href,
      location: location.address,
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
        <h1>{title}</h1>
        {host && (
          <>
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
              {startTime.getFullYear() % 100} {startTime.getHours() < 10 && "0"}
              {startTime.getHours()}h{startTime.getMinutes() < 10 && "0"}{startTime.getMinutes()} -{" "}
              {endTime.getHours()}h{endTime.getMinutes() < 10 && "0"}{endTime.getMinutes()}
            </a>
            <br />
            Hosted by{" "}
            <a href={host.url} target="_blank">
              {host.name}
            </a>
            <br />
            📌 <a href={location.url}>{location.address}</a>
          </>
        )}
        <br />
        <br />
        {children}{" "}
      </div>
    </>
  );
}
