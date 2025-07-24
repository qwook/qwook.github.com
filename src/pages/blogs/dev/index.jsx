import { createPage } from "../../../app";
import Banner from "../../../components/Banner";

export default function DevPage() {
  return (
    <>
      <Banner>Dev Log</Banner>
      <ul style={{
        listStyle: "none",
        padding: 0,
      }}>
        {[
          {
            title: "Custom Cursors on Chrome",
            link: "/blogs/dev/cursors",
            date: 1753346585922,
          },
        ].map(({ title, link, date }, idx) => {
          return (
            <li key={idx}>
              [{new Date(date).toDateString()}] <a href={link}>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

createPage(DevPage, { showPets: false });
