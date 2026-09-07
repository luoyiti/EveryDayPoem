import { useEffect, useMemo, useState } from "react";
import { App as LegacyApp } from "./AppLegacy.jsx";
import { TaichengPage } from "./TaichengPage.jsx";
import { WatershedPage } from "./WatershedPage.jsx";
import { VillageNightPage } from "./VillageNightPage.jsx";
import { AutumnLetterPage } from "./AutumnLetterPage.jsx";
import { StreamsidePage } from "./StreamsidePage.jsx";
import { AutumnRoadPage } from "./AutumnRoadPage.jsx";
import { GanluPage } from "./GanluPage.jsx";
import { MountainRainPage } from "./MountainRainPage.jsx";
import { AutumnLanePage } from "./AutumnLanePage.jsx";
import { LuanjiaRapidsPage } from "./LuanjiaRapidsPage.jsx";
import { XinliangFieldsPage } from "./XinliangFieldsPage.jsx";
import { AutumnBrothersPage } from "./AutumnBrothersPage.jsx";
import { TianjingshaAutumnPage } from "./TianjingshaAutumnPage.jsx";
import { HengtangRainPage } from "./HengtangRainPage.jsx";
import { XiamouseNightPage } from "./XiamouseNightPage.jsx";
import { SongfengRestPage } from "./SongfengRestPage.jsx";
import { WangboMountainPage } from "./WangboMountainPage.jsx";
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
  const navigate = (id) => { window.location.hash = id; };

  if (poem.layout === "wangbo-mountain") return <WangboMountainPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "songfeng-rest") return <SongfengRestPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "xiamouse-night") return <XiamouseNightPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "hengtang-rain") return <HengtangRainPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "tianjingsha-autumn") return <TianjingshaAutumnPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "autumn-brothers-stars") return <AutumnBrothersPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "xinliang-fields") return <XinliangFieldsPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "luanjia-rapids") return <LuanjiaRapidsPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "autumn-lane-light") return <AutumnLanePage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "mountain-rain-signal") return <MountainRainPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "ganlu-window") return <GanluPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "qiupu-road") return <AutumnRoadPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "streamside-breeze") return <StreamsidePage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "autumn-letter") return <AutumnLetterPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "village-night") return <VillageNightPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "watershed-parting") return <WatershedPage poem={poem} onNavigate={navigate} />;
  if (poem.layout === "taicheng-rain") return <TaichengPage poem={poem} onNavigate={navigate} />;
  return <LegacyApp key={routeId} />;
}
