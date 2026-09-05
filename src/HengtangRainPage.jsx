import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./hengtang-rain.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、；：\s]/g, "");
const METAPHOR_START = 9;

export function HengtangRainPage({ poem, onNavigate }) {
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
    } catch { /* Learning remains usable when storage is blocked. */ }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((index) => index + 1);
    setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="hengtang-page">
      <img className="hengtang-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="hengtang-wash" aria-hidden="true" />
      <div className="hengtang-rain-lines" aria-hidden="true" />

      <header className="hengtang-header">
        <div className="hengtang-brand"><strong>每日古诗文</strong><span>横塘 · 暮色 · 梅雨</span></div>
        <div><span>2026 / 09 / 06</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="hengtang-stage" aria-labelledby="hengtang-title">
        <div className="hengtang-title-block">
          <small>{poem.form} · 宋词</small>
          <h1 id="hengtang-title">青玉案</h1>
          <p>凌波不过横塘路</p>
          <span>{poem.dynasty} · {poem.author}</span>
        </div>

        <ol className="hengtang-route" aria-label="沿横塘逐句阅读">
          {poem.lines.slice(0, METAPHOR_START).map((line, index) => (
            <li key={line} className={`route-${index + 1} ${activeLine === index ? "is-active" : ""}`}>
              <button onClick={() => { setActiveLine(index); setPanel("annotation"); }} aria-current={activeLine === index ? "step" : undefined}>
                <i aria-hidden="true" />
                <span>{line}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </button>
            </li>
          ))}
        </ol>

        <aside className="hengtang-note" aria-live="polite">
          <small>{activeLine < 6 ? "目送 · 想象" : activeLine < 9 ? "暮色 · 题句" : "闲情 · 三喻"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>{String(activeLine + 1).padStart(2, "0")} / {poem.lines.length}</span>
        </aside>

        <div className="hengtang-metaphors" aria-label="结尾三重比喻">
          {poem.lines.slice(METAPHOR_START).map((line, offset) => {
            const index = METAPHOR_START + offset;
            return (
              <button key={line} className={`metaphor-${offset + 1} ${activeLine === index ? "is-active" : ""}`} onClick={() => { setActiveLine(index); setPanel("annotation"); }}>
                <small>0{offset + 1}</small><strong>{line}</strong><span aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      {panel !== "annotation" && (
        <aside className="hengtang-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="hengtang-tools" aria-label="词作学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        <button onClick={() => setHistory(true)}><List size={16} /> 历史</button>
      </nav>

      {study && (
        <div className="hengtang-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="hengtang-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="hengtang-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到横塘</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="hengtang-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "沿横塘下一句"}</button></div>
              </div>
            ) : (
              <div className="hengtang-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                <div className="hengtang-answer-grid">
                  {poem.lines.map((line, index) => {
                    const correct = normalize(answers[index]) === normalize(line);
                    return <label key={line}><span>{String(index + 1).padStart(2, "0")}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                  })}
                </div>
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="hengtang-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`hengtang-history ${history ? "is-open" : ""}`} aria-hidden={!history}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><span><strong>{item.title}</strong><small>{item.genre || "诗"} · {item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
