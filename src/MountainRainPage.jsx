import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./mountain-rain.css";

const STORAGE_KEY = "daily-poetry-progress-v1";

function normalize(value = "") {
  return value.replace(/[，。！？、\s]/g, "");
}

export function MountainRainPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.title = `每日古诗文 · ${poem.title}`;
  }, [poem.title]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setStudy(null);
        setHistory(false);
        setPanel("annotation");
      }
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
      const next = { ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Progress persistence is optional; study interactions stay usable without storage.
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
    <main className="mountain-rain-page">
      <img className="mountain-rain-texture" src={poem.image} alt="" aria-hidden="true" />
      <div className="mountain-rain-vignette" aria-hidden="true" />

      <header className="mountain-rain-brand">
        <span>每日古诗文</span>
        <button onClick={() => setHistory(true)}><BookOpenText size={18} /> 往日诗笺</button>
      </header>

      <section className="mountain-rain-heading" aria-labelledby="mountain-rain-title">
        <span className="mountain-rain-date">2026 / 09 / 01</span>
        <h1 id="mountain-rain-title">{poem.title}</h1>
        <p>{poem.dynasty} · {poem.author}</p>
      </section>

      <section className="weather-reading" aria-label="从晴夜到急溪的逐句阅读">
        <div className="weather-axis" aria-hidden="true">
          <span>夜 · 无雨</span><i /><span>平明 · 水急</span>
        </div>
        <div className="weather-lines">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`weather-line weather-line--${index + 1} ${activeLine === index ? "is-active" : ""}`}
              onClick={() => { setActiveLine(index); setPanel("annotation"); }}
              aria-current={activeLine === index ? "step" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{line}</strong>
            </button>
          ))}
        </div>
        <aside className="weather-note" aria-live="polite">
          <span>{activeLine < 2 ? "眼前仍晴" : "水带来远山消息"}</span>
          <strong>{poem.notes[activeLine].term}</strong>
          <p>{poem.notes[activeLine].text}</p>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="mountain-rain-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "译文" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{detailText}</p>
        </aside>
      )}

      <nav className="mountain-rain-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} />背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="mountain-rain-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="study-paper">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 返回山溪</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="study-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={advanceRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button></div>
              </div>
            ) : (
              <div className="study-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next=[...answers]; next[index]=event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="dictation-submit" onClick={submitDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`mountain-rain-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
