import "./genre.scss";

export function Genre({ list }) {
  return (
    <>
      {list.map((genre, idx) => {
        return (
          <>
            {idx > 0 && (idx === list.length - 1 ? ", and " : ", ")}
            <span className="genre">{genre}</span>
          </>
        );
      })}
    </>
  );
}
