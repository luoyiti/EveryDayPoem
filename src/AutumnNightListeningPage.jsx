import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./autumn-night-listening.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、；：“”‘’\s]/g, "");
const stages = ["独", "听", "叹", "观"];

export function AutumnNightListeningPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") { setStudy(null); setHistory(false); setPanel("annotation"); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const score = useMemo(() => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length, [answers, poem.lines]);

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } }));
    } catch { /* Study remains usable when storage is blocked. */ }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((index) => index + 1); setHidden(false);
  }

  function checkDictation() {
    setChecked(true); if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="autumn-night-page">
      <img className="autumn-night-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="autumn-night-veil" aria-hidden="true" />

      <header className="autumn-night-header">
        <a href="#" onClick={(event) => event.preventDefault()} className="autumn-night-brand"><strong>每日古诗文</strong><span>一夜 · 四层听觉</span></a>
        <div><span>2026 / 09 / 11</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="autumn-night-stage" aria-labelledby="autumn-night-title">
        <div className="autumn-night-heading">
          <p>雨夜 · 空堂 · 二更</p>
          <h1 id="autumn-night-title">{poem.title}</h1>
          <span>{poem.dynasty} · {poem.author}</span>
          <small>{poem.form}</small>
        </div>

        <div className="autumn-night-track" role="tablist" aria-label="从外界声响进入内观的四联">
          {poem.lines.map((line, index) => (
            <button key={line} role="tab" aria-selected={activeLine === index} className={activeLine === index ? "is-active" : ""} onClick={() => { setActiveLine(index); setPanel("annotation"); }}>
              <i aria-hidden="true"><b>{stages[index]}</b><span>{String(index + 1).padStart(2, "0")}</span></i>
              <strong>{line}</strong>
              <em>{index === 0 ? "空堂" : index === 1 ? "雨果 · 虫鸣" : index === 2 ? "白发 · 方术" : "老病 · 无生"}</em>
            </button>
          ))}
        </div>

        <aside className="autumn-night-note" aria-live="polite">
          <div className="autumn-night-meter" aria-hidden="true"><span style={{ "--night-step": activeLine }} /></div>
          <small>{activeLine < 2 ? "先听见夜" : "再听见自己"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <b>{String(activeLine + 1).padStart(2, "0")} / 04</b>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="autumn-night-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="autumn-night-tools" aria-label="作品学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="autumn-night-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="autumn-night-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="autumn-night-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到空堂</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="autumn-night-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 联 · {stages[reciteIndex]}</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "收住这一夜" : "听下一联"}</button></div>
              </div>
            ) : (
              <div className="autumn-night-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{stages[index]}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一联" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 联，继续核对。`}</p>}
                <button className="autumn-night-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`autumn-night-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.genre || "古诗文"} · {item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
