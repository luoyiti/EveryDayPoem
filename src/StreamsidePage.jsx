import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./streamside-breeze.css";

const STORAGE_KEY = "daily-poetry-progress-v1";

function readProgress() {
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

export function StreamsidePage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState("annotation");
  const [studyMode, setStudyMode] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setStudyMode(null); setHistoryOpen(false); setDetail("annotation"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const score = useMemo(() => answers.filter((answer, index) => answer.replace(/[，。！？、\s]/g, "") === poem.lines[index].replace(/[，。！？、\s]/g, "")).length, [answers, poem.lines]);

  function markComplete(kind) {
    setProgress((previous) => {
      const next = { ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function openStudy(mode) {
    setStudyMode(mode); setHistoryOpen(false); setChecked(false); setAnswers(poem.lines.map(() => "")); setReciteIndex(0); setHidden(false);
  }

  return (
    <main className="streamside-page">
      <div className="streamside-texture" aria-hidden="true"><img src={poem.image} alt="" /></div>
      <header className="streamside-brand"><span>每日古诗文</span><button onClick={() => setHistoryOpen(true)}><BookOpenText size={18} />往日诗笺</button></header>

      <section className="streamside-heading" aria-labelledby="streamside-title">
        <p>春日 · 溪湾即景</p>
        <h1 id="streamside-title">{poem.title}</h1>
        <span>{poem.dynasty} · {poem.author}</span>
      </section>

      <section className="drift-score" aria-label="逐句阅读">
        <div className="drift-axis" aria-hidden="true"><span>未系船</span><i /><span>柴门</span></div>
        {poem.lines.map((line, index) => (
          <button
            key={line}
            className={`drift-line drift-line--${index + 1} ${activeLine === index ? "is-active" : ""}`}
            onClick={() => { setActiveLine(index); setDetail("annotation"); }}
            aria-current={activeLine === index ? "step" : undefined}
          >
            <small>{String(index + 1).padStart(2, "0")}</small>
            <span>{line}</span>
          </button>
        ))}
        <div className={`drift-motion ${activeLine >= 2 ? "is-arrived" : ""}`} aria-hidden="true"><i /></div>
      </section>

      <aside className="streamside-note" aria-live="polite">
        <span>{poem.notes[activeLine].term}</span>
        <p>{poem.notes[activeLine].text}</p>
      </aside>

      {detail !== "annotation" && (
        <section className="streamside-detail" aria-live="polite">
          <header><span>{detail === "translation" ? "译文" : "赏析"}</span><button onClick={() => setDetail("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{detail === "translation" ? poem.translation : poem.appreciation}</p>
        </section>
      )}

      <nav className="streamside-tools" aria-label="诗词学习">
        <button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button>
        <button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button>
        <button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => openStudy("recitation")}>背诵</button>
        <button onClick={() => openStudy("dictation")}>默写</button>
      </nav>

      {historyOpen && (
        <div className="streamside-overlay" role="dialog" aria-modal="true" aria-label="往日诗笺">
          <button className="overlay-scrim" onClick={() => setHistoryOpen(false)} aria-label="关闭" />
          <section className="streamside-history">
            <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistoryOpen(false)} aria-label="关闭"><X size={20}/></button></header>
            {poems.map((item, index) => (
              <button className="history-item" key={item.id} onClick={() => { setHistoryOpen(false); onNavigate(item.id); }}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small>{progress[item.id]?.completed && <Check size={15}/>} 
              </button>
            ))}
          </section>
        </div>
      )}

      {studyMode && (
        <div className="streamside-overlay" role="dialog" aria-modal="true" aria-labelledby="streamside-study-title">
          <button className="overlay-scrim" onClick={() => setStudyMode(null)} aria-label="关闭" />
          <section className="streamside-study">
            <header><button onClick={() => setStudyMode(null)}><ArrowLeft size={17}/>返回诗境</button><span>{poem.title} · {studyMode === "dictation" ? "默写" : "背诵"}</span></header>
            {studyMode === "dictation" ? (
              <div className="dictation-pane">
                <h2 id="streamside-study-title">让漂来的小船停在字里</h2>
                {poem.lines.map((line, index) => {
                  const correct = answers[index].replace(/[，。！？、\s]/g, "") === line.replace(/[，。！？、\s]/g, "");
                  return <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}><span>{index + 1}</span><input value={answers[index]} onChange={(e)=>{const next=[...answers];next[index]=e.target.value;setAnswers(next);setChecked(false);}} placeholder="在这里默写……" autoFocus={index===0}/>{checked && !correct && <small>{line}</small>}</label>;
                })}
                <div className="study-actions"><p>{checked ? (score === poem.lines.length ? "四句无误，船、风、小童与柴门都记住了。" : `写对 ${score} 句，再沿着原句读一遍。`) : ""}</p><button onClick={()=>{setChecked(true);if(score===poem.lines.length)markComplete("dictation");}}>核对默写</button></div>
              </div>
            ) : (
              <div className="recite-pane">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small><h2 id="streamside-study-title">先看船走到哪里，再遮住原句</h2>
                <button className={`recite-card ${hidden ? "is-hidden" : ""}`} onClick={()=>setHidden(v=>!v)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? "在心里复述，再点一下查看。" : poem.notes[reciteIndex].text}</p>
                <div className="study-actions"><button className="quiet" onClick={()=>setHidden(v=>!v)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={()=>{if(reciteIndex===poem.lines.length-1){markComplete("recitation");setStudyMode(null);}else{setReciteIndex(v=>v+1);setHidden(false);}}}>{reciteIndex===poem.lines.length-1?"完成背诵":"下一句"}</button></div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
