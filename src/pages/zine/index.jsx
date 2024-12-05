import { createPage } from "../app";
import "./polaroids.scss";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ZinePage() {
  return (
    <div>
      <h1>zines</h1>
      <p>zine!</p>
    </div>
  );
}

createPage(ChaoPage, { showPets: false, showNav: false });
