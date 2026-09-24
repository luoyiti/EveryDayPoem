import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./spring-water-distance.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const views = [
  { mark: "行", title: "征辔渐远", hint: "从候馆与溪桥向外走" },
  { mark: "望", title: "春山更外", hint: "从行人心中转到楼上远望" },
];

export function SpringDistancePage({ poem, onNavigate }) {
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
    } catch { /* progress is optional */ }
  }
  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((value) => value + 1); setHidden(false);
  }
  function checkDictation() { setChecked(true); if (score === poem.lines.length) markComplete("dictation"); }

  return <main className="sd-page">
    <section className="sd-hero" aria-labelledby="sd-title">
      <img className="sd-image" src={poem.image} alt="" aria-hidden="true" />
      <div className="sd-scrim" aria-hidden="true" />
      <header className="sd-topbar">
        <a href="#tashaxing-mei-can"><strong>每日古诗文</strong><span>一路春水 · 两重视角</span></a>
        <button type="button" onClick={() => setHistory(true)}>往日篇章</button>
      </header>
      <div className="sd-heading">
        <small>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</small>
        <h1 id="sd-title">{poem.title}</h1>
        <p>{poem.author}<span>{poem.form}</span></p>
      </div>
      <p className="sd-thesis">行人越走越远，离愁却像春水越流越长；词到下片忽然回身，让远方的人从另一双眼睛里再次被看见。</p>
      <nav className="sd-route" aria-label="两重视角">
        {views.map((view, index) => <button key={view.mark} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
          <b>{view.mark}</b><span>{view.title}</span><small>{view.hint}</small>
        </button>)}
      </nav>
    </section>

    <section className="sd-reading" aria-label="原文与笺记">
      <header className="sd-reading-head">
        <div><small>一个离别，两处目光</small><h2>上片向外走，下片向远处望</h2></div>
        <p>点选“行 / 望”，或使用方向键，在行人与悬想中的居者之间切换。</p>
      </header>
      <div className="sd-waterline" aria-hidden="true"><span>春水</span></div>
      <div className="sd-dual">
        {poem.lines.map((line, index) => <button key={line} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>
          <small>{views[index].mark} · {views[index].title}</small>
          <p>{line}</p>
        </button>)}
      </div>
      <div className="sd-note" aria-live="polite">
        <div><small>此刻视角</small><strong>{views[active].title}</strong></div>
        <article><h3>{poem.notes[active].term}</h3><p>{poem.notes[active].text}</p></article>
      </div>
      <nav className="sd-tools" aria-label="学习工具">
        <button type="button" onClick={() => setPanel("translation")}>今译</button>
        <button type="button" onClick={() => setPanel("appreciation")}>赏析</button>
        <button type="button" onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button type="button" onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>
    </section>

    {panel && <div className="sd-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
      <button className="sd-backdrop" type="button" onClick={() => setPanel(null)} aria-label="关闭" />
      <section className="sd-sheet">
        <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button type="button" onClick={() => setPanel(null)}>关闭</button></header>
        <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        {panel === "appreciation" && <footer>真正拉开距离的不是春山，而是“春山外”三个字。</footer>}
      </section>
    </div>}

    {study && <div className="sd-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
      <button className="sd-backdrop" type="button" onClick={() => setStudy(null)} aria-label="关闭" />
      <section className="sd-study">
        <header><button type="button" onClick={() => setStudy(null)}>返回原文</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
        {study === "recitation" ? <div className="sd-recite">
          <small>{views[reciteIndex].title} · {reciteIndex + 1} / {poem.lines.length}</small>
          <button type="button" className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
          <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
          <div><button type="button" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button type="button" onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "切到另一重视角"}</button></div>
        </div> : <div className="sd-dictation">
          <h2>{poem.studyCopy.dictationTitle}</h2>
          {poem.lines.map((line, index) => {
            const correct = normalize(answers[index]) === normalize(line);
            return <label key={line}><span>{views[index].mark} · {views[index].title}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一片" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
          })}
          {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 片，继续核对。`}</p>}
          <button className="sd-check" type="button" onClick={checkDictation}>核对默写</button>
        </div>}
      </section>
    </div>}

    <aside className={`sd-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
      <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button type="button" onClick={() => setHistory(false)}>关闭</button></header>
      <div>{poems.map((item) => <button type="button" key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
    </aside>
  </main>;
}
