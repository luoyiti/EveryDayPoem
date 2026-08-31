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
import { poemsById } from "./data/poems.js";
import { dailyPoemId } from "./data/daily.js";
function resolvePoemId(){const hashId=window.location.hash.slice(1);return poemsById[hashId]?hashId:dailyPoemId;}
export function App(){const[routeId,setRouteId]=useState(resolvePoemId);useEffect(()=>{const onHashChange=()=>setRouteId(resolvePoemId());window.addEventListener("hashchange",onHashChange);return()=>window.removeEventListener("hashchange",onHashChange);},[]);const poem=useMemo(()=>poemsById[routeId]||poemsById[dailyPoemId],[routeId]);if(poem.layout === "mountain-rain-signal") return <MountainRainPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "ganlu-window") return <GanluPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "qiupu-road") return <AutumnRoadPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "streamside-breeze") return <StreamsidePage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "autumn-letter") return <AutumnLetterPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "village-night")return <VillageNightPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "watershed-parting")return <WatershedPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;if(poem.layout === "taicheng-rain")return <TaichengPage poem={poem} onNavigate={(id)=>{window.location.hash=id;}} />;return <LegacyApp key={routeId}/>;}
