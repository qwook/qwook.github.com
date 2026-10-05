import { useEffect, useMemo, useRef, useState } from "react";
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import anora from "../events/images/anora.gif";

export function Head() {
  return (
    <Meta
      title={"Zines from Henry"}
      description={"This is a zine test!"}
      image={anora}
    />
  );
}

function ZinePage() {
  return (
    <div>
      <h1>qwook.io/zine</h1>
      <ul>
        <li>issue 1</li>
      </ul>
    </div>
  );
}

export default function Root() {
  return (
    <Layout showNav={false}>
      <ZinePage />
    </Layout>
  );
}
