import { createPage } from "../../app";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ZinePage() {
  return (
    <div>
      <h1>qwook.io/zine</h1>
      <ul>
        <li>issue 1</li>
      </ul>
    </div>
  );
}

createPage(ZinePage, { showPets: false, showNav: false });
