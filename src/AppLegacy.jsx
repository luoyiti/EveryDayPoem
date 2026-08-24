import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BellRinging, BookOpenText, Check, Feather, List, SpeakerHigh, X } from "@phosphor-icons/react";
import { poems, poemsById } from "./data/poems.js";
import { dailyPoemId } from "./data/daily.js";
import "./lanxi-moon.css";
import "./jinling-ferry.css";

const STORAGE_KEY = "daily-poetry-progress-v1";

function readProgress() {
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function Brand({ dark = true }) {
  return <div className={`brand ${dark ? "brand--light" : "brand--dark"}`}><span>每日古诗文</span><i aria-hidden="true" /></div>;
}

function PageImage({ src, position = "center" }) {
  return <div className="scene" aria-hidden="true"><img src={src} alt="" style={{ objectPosition: position }} /></div>;
}

function HistoryDrawer({ open, onClose, onSelect, currentId, progress }) {
  return (
    <aside className={`history-drawer ${open ? "is-open" : ""}`} aria-hidden={!open} inert={open ? undefined : true}>
      <header className="history-header"><div><span className="eyebrow">已读 · {poems.length}首</span><h2>往日诗笺</h2></div><button className="icon-button" onClick={onClose} aria-label="关闭诗笺集"><X size={20} weight="light" /></button></header>
      <div className="history-list">
        {poems.map((poem, index) => (
          <button className={`history-row ${poem.id === currentId ? "is-current" : ""}`} key={poem.id} onClick={() => onSelect(poem.id)}>
            <span className="history-number">{String(index + 1).padStart(2, "0")}</span>
            <img src={poem.image} alt={`${poem.title}页面意境预览`} />
            <span className="history-copy"><strong>{poem.title}</strong><small>{poem.dynasty} · {poem.author}</small><em>{poem.learnedAt}</em></span>
            <span className="history-status" aria-label={progress[poem.id]?.completed ? "已完成" : "未完成"}>{progress[poem.id]?.completed ? <Check size={15} /> : "阅"}</span>
          </button>
        ))}
      </div>
      <p className="history-note">每一次打开，回到诗第一次抵达你的那片风景。</p>
    </aside>
  );
}

function StudyOverlay({ poem, mode, onClose, onComplete }) {
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => { setAnswers(poem.lines.map(() => "")); setChecked(false); setReciteIndex(0); setHidden(false); }, [poem.id, mode]);
  if (!mode) return null;
  const score = answers.filter((answer, index) => answer.replace(/[，。！？、\s]/g, "") === poem.lines[index].replace(/[，。！？、\s]/g, "")).length;
  function submitDictation() { setChecked(true); if (score === poem.lines.length) onComplete("dictation"); }
  function advanceRecitation() { if (reciteIndex === poem.lines.length - 1) { onComplete("recitation"); onClose(); return; } setReciteIndex((value) => value + 1); setHidden(false); }
  return (
    <div className="study-overlay" role="dialog" aria-modal="true" aria-labelledby="study-title">
      <div className="study-backdrop" onClick={onClose} />
      <section className={`study-sheet study-sheet--${mode}`}>
        <header><button className="study-back" onClick={onClose}><ArrowLeft size={18} /> 返回诗境</button><span>{poem.title} · {mode === "dictation" ? "默写" : "背诵"}</span></header>
        {mode === "dictation" ? (
          <div className="dictation-content">
            <div><span className="eyebrow">不看原文，写下你记得的句子</span><h2 id="study-title">{poem.studyCopy?.dictationTitle || "让诗句留在字里"}</h2></div>
            <div className="dictation-lines">{poem.lines.map((line, index) => { const isCorrect = answers[index].replace(/[，。！？、\s]/g, "") === line.replace(/[，。！？、\s]/g, ""); return <label key={line} className={checked ? (isCorrect ? "is-correct" : "is-wrong") : ""}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="在这里默写……" autoFocus={index === 0} />{checked && !isCorrect && <small>{line}</small>}{checked && isCorrect && <Check size={18} />}</label>; })}</div>
            <div className="study-actions">{checked && <p>{score === poem.lines.length ? (poem.studyCopy?.dictationSuccess || "一字不差。") : `写对 ${score} 句，再沿着原句读一遍。`}</p>}<button className="primary-button" onClick={submitDictation}>核对默写</button></div>
          </div>
        ) : (
          <div className="recitation-content"><span className="eyebrow">第 {reciteIndex + 1} / {poem.lines.length} 句</span><h2 id="study-title">先读，再让它消失</h2><button className={`recite-line ${hidden ? "is-hidden" : ""}`} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button><p>{hidden ? (poem.studyCopy?.recitationHint || "在心里说出这一句，再轻触查看。") : poem.notes[reciteIndex].text}</p><div className="study-actions"><button className="quiet-button" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button className="primary-button" onClick={advanceRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button></div></div>
        )}
      </section>
    </div>
  );
}

function DetailPanel({ poem, mode, onClose }) {
  if (!mode || mode === "annotation") return null;
  const title = mode === "translation" ? "译文" : "赏析";
  const content = mode === "translation" ? poem.translation : poem.appreciation;
  return <section className="detail-panel" aria-live="polite"><header><span>{title}</span><button onClick={onClose} aria-label={`关闭${title}`}><X size={17} /></button></header><p>{content}</p></section>;
}

function playBell() {
  const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
  const context = new AudioContext(); const gain = context.createGain(); gain.gain.setValueAtTime(0.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.14, context.currentTime + 0.03); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.8); gain.connect(context.destination);
  [196, 294, 392].forEach((frequency, index) => { const oscillator = context.createOscillator(); oscillator.type = "sine"; oscillator.frequency.setValueAtTime(frequency, context.currentTime); oscillator.detune.setValueAtTime(index * 4, context.currentTime); oscillator.connect(gain); oscillator.start(context.currentTime + index * 0.02); oscillator.stop(context.currentTime + 3); });
}

function MapleNight({ poem, onHistory, onStudy }) {
  const [activeLine, setActiveLine] = useState(1); const [detail, setDetail] = useState("annotation"); const [bellActive, setBellActive] = useState(false);
  function ringBell() { playBell(); setBellActive(true); window.setTimeout(() => setBellActive(false), 2400); }
  return <main className="poem-page maple-night"><PageImage src={poem.image} position="center center" /><div className="maple-tint" aria-hidden="true" /><Brand /><section className="maple-reading" aria-labelledby="poem-title"><header className="poem-heading"><span>{poem.dynasty}</span><h1 id="poem-title">{poem.title}</h1><p>{poem.dynasty} · {poem.author}</p></header><div className="maple-verses">{poem.lines.map((line, index) => <div className={`maple-verse ${activeLine === index ? "is-active" : ""}`} key={line}>{activeLine === index && detail === "annotation" && <p className="verse-note"><strong>{poem.notes[index].term}</strong>{poem.notes[index].text}</p>}<button onClick={() => { setActiveLine(index); setDetail("annotation"); }}><span>{line}</span></button>{index === poem.lines.length - 1 && <button className="dictation-cta" onClick={() => onStudy("dictation")}>开始默写</button>}</div>)}</div></section><button className={`bell-button ${bellActive ? "is-ringing" : ""}`} onClick={ringBell}><BellRinging size={18} weight="light" /><span>{bellActive ? "钟声正越过江面" : "听一声夜半钟"}</span></button><DetailPanel poem={poem} mode={detail} onClose={() => setDetail("annotation")} /><nav className="maple-rail" aria-label="诗词学习"><button className="history-trigger" onClick={onHistory}><BookOpenText size={20} weight="light" /><span>诗笺集</span></button><div className="rail-items"><button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}><span>注释</span><i /></button><button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}><span>译文</span><i /></button><button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}><span>赏析</span><i /></button><button onClick={() => onStudy("recitation")}><span>背诵</span><i /></button></div></nav></main>;
}

function SnowRiver({ poem, onHistory, onStudy }) {
  const [showMeaning, setShowMeaning] = useState(false);
  return <main className="poem-page snow-river"><PageImage src={poem.image} position="center center" /><Brand dark={false} /><button className="snow-history" onClick={onHistory}><List size={18} /> 往日诗笺</button><div className="snow-index">贰<br /><span>孤舟 · 寒江</span></div><section className="snow-composition" aria-labelledby="snow-title"><header><span>{poem.dynasty} · {poem.author}</span><h1 id="snow-title">{poem.title}</h1></header><div className="snow-verses">{poem.lines.map((line) => <p key={line}>{line}</p>)}</div></section><aside className={`snow-meaning ${showMeaning ? "is-open" : ""}`}><span>诗意</span><p>{poem.translation}</p></aside><div className="snow-actions"><button onClick={() => setShowMeaning((value) => !value)}>{showMeaning ? "收起诗意" : "展开诗意"}</button><button onClick={() => onStudy("recitation")}><Feather size={17} /> 开始背诵</button></div></main>;
}

function SpringDawn({ poem, onHistory, onStudy }) {
  const [activeLine, setActiveLine] = useState(0);
  return <main className="poem-page spring-dawn"><PageImage src={poem.image} position="center center" /><div className="spring-wash" aria-hidden="true" /><Brand dark={false} /><button className="spring-history" onClick={onHistory}><BookOpenText size={18} /> 诗笺集</button><section className="spring-copy" aria-labelledby="spring-title"><header><span>晨起 · 第三笺</span><h1 id="spring-title">{poem.title}</h1><p>{poem.dynasty} · {poem.author}</p></header><div className="spring-verses">{poem.lines.map((line, index) => <button className={activeLine === index ? "is-active" : ""} key={line} onClick={() => setActiveLine(index)}>{line}</button>)}</div><p className="spring-note"><strong>{poem.notes[activeLine].term}</strong>{poem.notes[activeLine].text}</p><div className="spring-actions"><button onClick={() => onStudy("recitation")}><SpeakerHigh size={18} /> 轻声诵读</button><button onClick={() => onStudy("dictation")}>开始默写</button></div></section></main>;
}

function XianyangRain({ poem, onHistory, onStudy }) {
  const [activeLine, setActiveLine] = useState(0); const [detail, setDetail] = useState("annotation"); const detailTitle = detail === "translation" ? "译文" : "赏析"; const detailContent = detail === "translation" ? poem.translation : poem.appreciation;
  function moveLine(offset) { setActiveLine((index) => Math.min(poem.lines.length - 1, Math.max(0, index + offset))); setDetail("annotation"); }
  return <main className="poem-page xianyang-rain"><PageImage src={poem.image} position="center center" /><Brand /><header className="rain-heading"><h1>{poem.title}</h1><p>{poem.dynasty} · {poem.author}</p></header><button className="rain-history" onClick={onHistory}><BookOpenText size={18} weight="light" /> 往日诗笺</button><section className="rain-stage" aria-labelledby="rain-active-line"><nav className="rain-layers" aria-label="逐句阅读">{poem.lines.map((line, index) => <button className={activeLine === index ? "is-active" : ""} key={line} onClick={() => { setActiveLine(index); setDetail("annotation"); }} aria-label={`阅读第 ${index + 1} 句：${line}`} aria-current={activeLine === index ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /></button>)}</nav><div className="rain-reading"><span className="rain-count">第 {activeLine + 1} / {poem.lines.length} 句</span><p id="rain-active-line" className="rain-active-line" aria-live="polite">{poem.lines[activeLine]}</p><div className="rain-note" aria-live="polite"><strong>{poem.notes[activeLine].term}</strong><p>{poem.notes[activeLine].text}</p></div><div className="rain-step-actions"><button onClick={() => moveLine(-1)} disabled={activeLine === 0}>上一层</button><button onClick={() => moveLine(1)} disabled={activeLine === poem.lines.length - 1}>下一层雨</button></div></div></section>{detail !== "annotation" && <aside className="rain-detail" aria-live="polite"><header><span>{detailTitle}</span><button onClick={() => setDetail("annotation")} aria-label={`关闭${detailTitle}`}><X size={17} /></button></header><p>{detailContent}</p></aside>}<nav className="rain-tools" aria-label="诗词学习"><button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button><button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button><button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button><button onClick={() => onStudy("recitation")}>背诵</button><button onClick={() => onStudy("dictation")}>默写</button></nav></main>;
}

function LanxiMoon({ poem, onHistory, onStudy }) {
  const [activeLine, setActiveLine] = useState(0); const [detail, setDetail] = useState("annotation"); const detailTitle = detail === "translation" ? "译文" : "赏析"; const detailContent = detail === "translation" ? poem.translation : poem.appreciation;
  return <main className="poem-page lanxi-moon"><PageImage src={poem.image} position="center center" /><div className="lanxi-shade" aria-hidden="true" /><Brand /><button className="lanxi-history" onClick={onHistory}><BookOpenText size={18} weight="light" /> 往日诗笺</button><header className="lanxi-heading"><span>兰溪 · 春夜</span><h1>{poem.title}</h1><p>{poem.dynasty} · {poem.author}</p></header><section className="lanxi-reading" aria-label="兰溪棹歌逐句阅读"><div className="lanxi-verses">{poem.lines.map((line, index) => <button key={line} className={activeLine === index ? "is-active" : ""} onClick={() => { setActiveLine(index); setDetail("annotation"); }} aria-current={activeLine === index ? "step" : undefined}><span className="lanxi-number">{String(index + 1).padStart(2, "0")}</span><span className="lanxi-line">{line}</span><i aria-hidden="true" /></button>)}</div><div className="lanxi-annotation" aria-live="polite"><strong>{poem.notes[activeLine].term}</strong><p>{poem.notes[activeLine].text}</p></div></section>{detail !== "annotation" && <aside className="lanxi-detail" aria-live="polite"><header><span>{detailTitle}</span><button onClick={() => setDetail("annotation")} aria-label={`关闭${detailTitle}`}><X size={17} /></button></header><p>{detailContent}</p></aside>}<nav className="lanxi-tools" aria-label="诗词学习"><button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button><button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button><button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button><button onClick={() => onStudy("recitation")}>背诵</button><button onClick={() => onStudy("dictation")}>默写</button></nav></main>;
}

function JinlingFerry({ poem, onHistory, onStudy }) {
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState("annotation");
  const detailTitle = detail === "translation" ? "译文" : "赏析";
  const detailContent = detail === "translation" ? poem.translation : poem.appreciation;
  const distanceLabels = ["渡口", "旅夜", "夜江", "瓜州"];
  return (
    <main className="poem-page jinling-ferry">
      <PageImage src={poem.image} position="center center" />
      <div className="jinling-shade" aria-hidden="true" />
      <Brand />
      <button className="jinling-history" onClick={onHistory}><BookOpenText size={18} weight="light" /> 往日诗笺</button>
      <header className="jinling-heading"><span>西津渡 · 夜泊</span><h1>{poem.title}</h1><p>{poem.dynasty} · {poem.author}</p></header>
      <section className="jinling-sightline" aria-label="从小山楼望向瓜州的逐句阅读">
        {poem.lines.map((line, index) => (
          <button key={line} className={activeLine === index ? "is-active" : ""} onClick={() => { setActiveLine(index); setDetail("annotation"); }} aria-current={activeLine === index ? "step" : undefined}>
            <span className="jinling-distance">{distanceLabels[index]}</span><span className="jinling-line">{line}</span><i aria-hidden="true" />
          </button>
        ))}
      </section>
      <div className="jinling-note" aria-live="polite"><strong>{poem.notes[activeLine].term}</strong><p>{poem.notes[activeLine].text}</p></div>
      {detail !== "annotation" && <aside className="jinling-detail" aria-live="polite"><header><span>{detailTitle}</span><button onClick={() => setDetail("annotation")} aria-label={`关闭${detailTitle}`}><X size={17} /></button></header><p>{detailContent}</p></aside>}
      <nav className="jinling-tools" aria-label="诗词学习"><button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button><button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button><button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button><button onClick={() => onStudy("recitation")}>背诵</button><button onClick={() => onStudy("dictation")}>默写</button></nav>
    </main>
  );
}

export function App() {
  const initialId = window.location.hash.slice(1);
  const [currentId, setCurrentId] = useState(poemsById[initialId] ? initialId : dailyPoemId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [studyMode, setStudyMode] = useState(null);
  const [progress, setProgress] = useState(readProgress);
  const poem = useMemo(() => poemsById[currentId] || poemsById[dailyPoemId], [currentId]);
  useEffect(() => { const onHashChange = () => { const next = window.location.hash.slice(1); if (poemsById[next]) setCurrentId(next); }; window.addEventListener("hashchange", onHashChange); return () => window.removeEventListener("hashchange", onHashChange); }, []);
  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => { const onKeyDown = (event) => { if (event.key !== "Escape") return; setHistoryOpen(false); setStudyMode(null); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, []);
  function selectPoem(id) { setCurrentId(id); setHistoryOpen(false); setStudyMode(null); window.location.hash = id; }
  function completeStudy(kind) { setProgress((previous) => { const next = { ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } }; window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next; }); }
  return <div className="app-shell"><div inert={historyOpen || studyMode ? true : undefined}>{poem.layout === "jinling-ferry" && <JinlingFerry poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}{poem.layout === "lanxi-moon" && <LanxiMoon poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}{poem.layout === "xianyang-rain" && <XianyangRain poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}{poem.layout === "maple-night" && <MapleNight poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}{poem.layout === "snow-river" && <SnowRiver poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}{poem.layout === "spring-dawn" && <SpringDawn poem={poem} onHistory={() => setHistoryOpen(true)} onStudy={setStudyMode} />}</div><HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} onSelect={selectPoem} currentId={poem.id} progress={progress} /><div className={`drawer-scrim ${historyOpen ? "is-visible" : ""}`} onClick={() => setHistoryOpen(false)} /><StudyOverlay poem={poem} mode={studyMode} onClose={() => setStudyMode(null)} onComplete={completeStudy} /></div>;
}
