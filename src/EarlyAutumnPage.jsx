import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./early-autumn.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const phases = ["夜", "露", "晓", "叶"];
const phaseNotes = ["长夜 · 西风", "残萤 · 早雁", "高树 · 远山", "一叶 · 烟波"];

export function EarlyAutumnPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setDetail(null); setStudy(null); setHistory(false); }
      if (!study && !history && ["ArrowDown", "ArrowRight"].includes(event.key)) setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (!study && !history && ["ArrowUp", "ArrowLeft"].includes(event.key)) setActive((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, poem.lines.length, study]);

  const score = useMemo(
    () => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length,
    [answers, poem.lines]
  );

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...previous,
        [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() },
      }));
    } catch { /* Keep study usable when storage is unavailable. */ }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((value) => value + 1);
    setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="ea-page">
      <img className="ea-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="ea-atmosphere" aria-hidden="true" />
      <div className="ea-horizon" aria-hidden="true" />

      <header className="ea-header">
        <a className="ea-brand" href="#early-autumn-leaf" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong><span>一夜之间 · 秋意初生</span>
        </a>
        <div className="ea-meta"><span>2026.09.15 · {poem.dynasty} · {poem.genre}</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="ea-stage" aria-labelledby="ea-title">
        <aside className="ea-title-block">
          <small>{poem.form}</small>
          <h1 id="ea-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="ea-time-key" aria-label="从夜到晓的阅读时间线"><span>夜</span><i /><span>晓</span></div>
        </aside>

        <nav className="ea-phase-rail" aria-label="四联时间节点">
          {phases.map((phase, index) => <button key={phase} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`阅读第${index + 1}联：${phaseNotes[index]}`}><b>{phase}</b><span>{phaseNotes[index]}</span></button>)}
        </nav>

        <div className="ea-verses" aria-label="原文四联">
          {poem.lines.map((line, index) => (
            <button key={line} className={`ea-verse ea-verse-${index + 1} ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
              <small>0{index + 1}</small><strong>{line}</strong>
            </button>
          ))}
        </div>

        <aside className="ea-note" aria-live="polite">
          <div><small>秋意刻度</small><b>{phases[active]}</b></div>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>沿天光再读一联 →</button>
        </aside>
      </section>

      <nav className="ea-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <aside className="ea-detail" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
        <button className="ea-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section><header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header><p>{detail === "translation" ? poem.translation : poem.appreciation}</p></section>
      </aside>}

      {study && <div className="ea-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="ea-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="ea-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到秋夜</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? <div className="ea-recite"><small>{phases[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small><button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button><p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p><div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "覆去原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "走向下一刻"}</button></div></div>
          : <div className="ea-dictation"><h2>{poem.studyCopy.dictationTitle}</h2>{poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={line}><span>{phases[index]} · {phaseNotes[index]}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一联" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>; })}{checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 联，继续核对。`}</p>}<button className="ea-submit" onClick={checkDictation}>核对默写</button></div>}
        </section>
      </div>}

      <aside className={`ea-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
