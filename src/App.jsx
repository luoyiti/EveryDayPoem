import { useEffect, useMemo, useState } from "react";
import { App as LegacyApp } from "./AppLegacy.jsx";
import { TaichengPage } from "./TaichengPage.jsx";
import { poemsById } from "./data/poems.js";
import { dailyPoemId } from "./data/daily.js";

function resolvePoemId() {
  const hashId = window.location.hash.slice(1);
  return poemsById[hashId] ? hashId : dailyPoemId;
}

export function App() {
  const [routeId, setRouteId] = useState(resolvePoemId);

  useEffect(() => {
    const onHashChange = () => setRouteId(resolvePoemId());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const poem = useMemo(() => poemsById[routeId] || poemsById[dailyPoemId], [routeId]);

  if (poem.layout === "taicheng-rain") {
    return <TaichengPage poem={poem} onNavigate={(id) => { window.location.hash = id; }} />;
  }

  return <LegacyApp key={routeId} />;
}
