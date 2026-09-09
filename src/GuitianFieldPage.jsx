import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./guitian-field.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’\s]/g, "");
const stageLabels = ["辞", "春", "游", "归"];

export function GuitianFieldPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
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
    } catch { /* learning remains usable if storage is unavailable */ }
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
    <main className="guitian-page">
      <img className="guitian-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="guitian-wash" aria-hidden="true" />

      <header className="guitian-header">
        <a href="#" onClick={(event) => event.preventDefault()} className="guitian-brand">
          <strong>每日古诗文</strong><span>一篇 · 一境</span>
        </a>
        <div><span>2026 / 09 / 10</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="guitian-stage" aria-labelledby="guitian-title">
        <div className="guitian-title-block">
          <p>{poem.dynasty} · {poem.form}</p>
          <h1 id="guitian-title">{poem.title}</h1>
          <span>{poem.author}</span>
          <small>从都邑退到春野，再从游赏收回蓬庐。</small>
        </div>

        <div className="guitian-reading">
          <nav className="guitian-steps" aria-label="归田赋四段章法">
            {poem.lines.map((_, index) => (
              <button key={stageLabels[index]} className={active === index ? "is-active" : ""} onClick={() => { setActive(index); setPanel("annotation"); }} aria-current={active === index ? "step" : undefined}>
                <span>{stageLabels[index]}</span><small>0{index + 1}</small>
              </button>
            ))}
          </nav>
          <article className="guitian-original" aria-live="polite">
            <small>{active === 0 ? "尘中去意" : active === 1 ? "仲春开野" : active === 2 ? "山泽游赏" : "日暮归庐"}</small>
            <p>{poem.lines[active]}</p>
          </article>
        </div>

        <aside className="guitian-note" aria-live="polite">
          <small>章法注 · 0{active + 1}</small>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="guitian-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="guitian-tools" aria-label="作品学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="guitian-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="guitian-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="guitian-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到春野</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="guitian-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 段 · {stageLabels[reciteIndex]}</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "遮住原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一段"}</button></div>
              </div>
            ) : (
              <div className="guitian-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={index}><span>0{index + 1}</span><textarea value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder={`默写“${stageLabels[index]}”这一段`} />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
                <button className="guitian-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`guitian-history ${history ? "is-open" : ""}`} aria-hidden={!history}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
