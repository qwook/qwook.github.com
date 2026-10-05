import Banner from "@/common/components/Banner";
import Layout from "@/common/layout/Layout";

function DevPage() {
  return (
    <>
      <Banner>Dev Log</Banner>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
        }}
      >
        {[
          {
            title: "Sk2tch: I made my own game engine",
            link: "/blogs/dev/sk2tch",
            date: 1753408025058,
          },
          {
            title: "Custom cursors in Javascript and CSS.",
            link: "/blogs/dev/cursors",
            date: 1753346585922,
          },
        ].map(({ title, link, date }, idx) => {
          return (
            <li key={idx}>
              [{new Date(date).toDateString()}] <a href={link}>{title}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function Root() {
  return (
    <Layout>
      <DevPage />
    </Layout>
  );
}
