import { useEffect, useState } from "react";
import { App } from "./App.jsx";
import { poemsById } from "./data/poems.js";
import { SpringPathPage } from "./SpringPathPage.jsx";

export function RootRouter() {
  const readHash = () => window.location.hash.slice(1);
  const [hash, setHash] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => setHash(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (!hash || hash === "spring-path" || !poemsById[hash]) return <SpringPathPage />;
  return <App key={hash} />;
}
