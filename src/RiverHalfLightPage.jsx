import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./river-half-light.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stations = [
  { mark: "河", title: "岸阔樯稀", hint: "先把视野放到最远" },
  { mark: "山", title: "半山夕照", hint: "再让余光停在半面山" },
];

export function RiverHalfLightPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); return; }
      if (panel || study || history) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") setActive(1);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActive(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, panel, study]);

  const score = useMemo(() => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length, [answers, poem.lines]);

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } }));
    } catch { /* local progress is optional */ }
  }
  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((value) => value + 1); setHidden(false);
  }
  function checkDictation() { setChecked(true); if (score === poem.lines.length) markComplete("dictation"); }

  return <main className="rh-page">
    <section className="rh-hero" aria-labelledby="rh-title">
      <img className="rh-image" src={poem.image} alt="" aria-hidden="true" />
      <div className="rh-vignette" aria-hidden="true" />
      <header className="rh-topbar">
        <a href="#river-half-sunset"><strong>每日古诗文</strong><span>河亭远望 · 秋山半明</span></a>
        <button type="button" onClick={() => setHistory(true)}>往日篇章</button>
      </header>

      <div className="rh-heading">
        <small>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</small>
        <h1 id="rh-title">{poem.title}</h1>
        <p>{poem.author}<span>{poem.form}</span></p>
      </div>

      <p className="rh-thesis">河面越开，人的身影越小；视线越过疏林，最后只让半面秋山留住夕阳。</p>

      <nav className="rh-horizon" aria-label="两层远望">
        {stations.map((station, index) => <button key={station.mark} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
          <b>{station.mark}</b><span>{station.title}</span><small>{station.hint}</small>
        </button>)}
      </nav>
    </section>

    <section className="rh-reading" aria-label="原文与笺记">
      <header className="rh-reading-head">
        <div><small>两次远望</small><h2>先凭栏，再越过疏林</h2></div>
        <p>点选上下两层原文，或使用方向键，在河与山之间移动视线。</p>
      </header>

      <div className="rh-lines" role="list" aria-label="书河上亭壁全文">
        {poem.lines.map((line, index) => <button role="listitem" key={line} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>
          <span>{String(index + 1).padStart(2, "0")} · {stations[index].mark}</span>
          <p>{line}</p>
        </button>)}
      </div>

      <div className="rh-note" aria-live="polite">
        <div><small>此刻所见</small><strong>{stations[active].title}</strong></div>
        <article><h3>{poem.notes[active].term}</h3><p>{poem.notes[active].text}</p></article>
      </div>

      <nav className="rh-tools" aria-label="学习工具">
        <button type="button" onClick={() => setPanel("translation")}>今译</button>
        <button type="button" onClick={() => setPanel("appreciation")}>赏析</button>
        <button type="button" onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button type="button" onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>
    </section>

    {panel && <div className="rh-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
      <button className="rh-scrim" type="button" onClick={() => setPanel(null)} aria-label="关闭" />
      <section className="rh-sheet">
        <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button type="button" onClick={() => setPanel(null)}>关闭</button></header>
        <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        {panel === "appreciation" && <footer>“一半”让夕照和暮色同时存在，也让全诗停在未尽的远望里。</footer>}
      </section>
    </div>}

    {study && <div className="rh-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
      <button className="rh-scrim" type="button" onClick={() => setStudy(null)} aria-label="关闭" />
      <section className="rh-study">
        <header><button type="button" onClick={() => setStudy(null)}>返回原文</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
        {study === "recitation" ? <div className="rh-recite">
          <small>{stations[reciteIndex].title} · {reciteIndex + 1} / {poem.lines.length}</small>
          <button type="button" className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
          <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
          <div><button type="button" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button type="button" onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "望向下一层"}</button></div>
        </div> : <div className="rh-dictation">
          <h2>{poem.studyCopy.dictationTitle}</h2>
          {poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={line}><span>{String(index + 1).padStart(2, "0")} · {stations[index].title}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一联" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>; })}
          {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 联，继续核对。`}</p>}
          <button className="rh-check" type="button" onClick={checkDictation}>核对默写</button>
        </div>}
      </section>
    </div>}

    <aside className={`rh-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
      <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button type="button" onClick={() => setHistory(false)}>关闭</button></header>
      <div>{poems.map((item) => <button type="button" key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
    </aside>
  </main>;
}
