import { google, outlook, office365, yahoo, ics } from "calendar-link";
import { useMemo } from "react";

import "./event.scss";

export function Event({
  title,
  host,
  start,
  location,
  description,
  children,
  duration,
}) {
  const startTime = useMemo(() => new Date(start));

  const calendarLink = useMemo(() => {
    const event = {
      title,
      host,
      description: window.location,
      location: location.address,
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
        <h1>{title}</h1>
        {host && (
          <>
            <a href={calendarLink.google} target="_blank">
              {startTime.getDate()}/{startTime.getMonth() + 1}/
              {startTime.getFullYear() % 100} {startTime.getHours() < 10 && "0"}
              {startTime.getHours()}h{startTime.getMinutes()}
            </a>
            <br />
            Hosted by{" "}
            <a href={host.url} target="_blank">
              {host.name}
            </a>
            <br />
            Kế bên <a href={location.url}>{location.address}</a>
          </>
        )}
        <br />
        <br />
        {children}{" "}
      </div>
    </>
  );
}
