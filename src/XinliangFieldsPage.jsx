import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./xinliang-fields.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、\s]/g, "");

export function XinliangFieldsPage({ poem, onNavigate }) {
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
    setReciteIndex((index) => index + 1); setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="xinliang-page">
      <img className="xinliang-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="xinliang-mist" aria-hidden="true" />
      <header className="xinliang-header">
        <a href="#" onClick={(event) => event.preventDefault()} className="xinliang-brand"><strong>每日古诗文</strong><span>一晨 · 一凉</span></a>
        <div><span>2026 / 09 / 04</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="xinliang-stage" aria-labelledby="xinliang-title">
        <div className="xinliang-title-block">
          <p>初秋 · 晓烟 · 黄莺</p>
          <h1 id="xinliang-title">{poem.title}</h1>
          <span>{poem.dynasty} · {poem.author}</span>
          <small>先沿田畴横读两句，再随黄莺斜向远山；静景在第三句开始移动。</small>
        </div>

        <ol className="xinliang-fields" aria-label="沿田畴逐句阅读">
          {poem.lines.map((line, index) => (
            <li key={line} className={`field-${index + 1} ${activeLine === index ? "is-active" : ""}`}>
              <button onClick={() => { setActiveLine(index); setPanel("annotation"); }} aria-current={activeLine === index ? "step" : undefined}>
                <small>0{index + 1}</small><strong>{line}</strong><i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>

        <aside className="xinliang-note" aria-live="polite">
          <small>{activeLine < 2 ? "田面 · 光雾" : "莺影 · 远山"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>0{activeLine + 1} / 04</span>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="xinliang-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="xinliang-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="xinliang-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="xinliang-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="xinliang-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到田畴</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="xinliang-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "随莺下一句"}</button></div>
              </div>
            ) : (
              <div className="xinliang-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="xinliang-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`xinliang-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
