import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./autumn-lane.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、\s]/g, "");

export function AutumnLanePage({ poem, onNavigate }) {
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
    const onKeyDown = (event) => {
      if (event.key === "Escape") { setStudy(null); setHistory(false); setPanel("annotation"); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    } catch {
      // Learning remains available when storage is unavailable.
    }
  }

  function submitDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  function advanceRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      markComplete("recitation");
      setStudy(null);
      return;
    }
    setReciteIndex((value) => value + 1);
    setHidden(false);
  }

  const detailText = panel === "translation" ? poem.translation : poem.appreciation;

  return (
    <main className="autumn-lane-page">
      <img className="autumn-lane-texture" src={poem.image} alt="" aria-hidden="true" />
      <div className="autumn-lane-shade" aria-hidden="true" />

      <header className="autumn-lane-header">
        <div><strong>每日古诗文</strong><span>2026 / 09 / 02</span></div>
        <button onClick={() => setHistory(true)}><BookOpenText size={18} /> 往日诗笺</button>
      </header>

      <section className="autumn-lane-title" aria-labelledby="autumn-lane-title-text">
        <p>反照 · 空道 · 风动</p>
        <h1 id="autumn-lane-title-text">{poem.title}</h1>
        <span>{poem.dynasty} · {poem.author}</span>
      </section>

      <section className="autumn-lane-reading" aria-label="沿闾巷走向古道的逐句阅读">
        <ol className="autumn-lane-verses">
          {poem.lines.map((line, index) => (
            <li key={line} style={{ "--lane-step": index }}>
              <button
                className={activeLine === index ? "is-active" : ""}
                onClick={() => { setActiveLine(index); setPanel("annotation"); }}
                aria-current={activeLine === index ? "step" : undefined}
              >
                <small>0{index + 1}</small><strong>{line}</strong><i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>

        <aside className="autumn-lane-note" aria-live="polite">
          <span>{activeLine < 2 ? "巷内 · 余照" : activeLine === 2 ? "道上 · 无人" : "田边 · 风起"}</span>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="autumn-lane-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "译文" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{detailText}</p>
        </aside>
      )}

      <nav className="autumn-lane-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="autumn-lane-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="autumn-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="autumn-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 返回闾巷</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="autumn-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={advanceRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button></div>
              </div>
            ) : (
              <div className="autumn-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="autumn-dictation-submit" onClick={submitDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`autumn-lane-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
