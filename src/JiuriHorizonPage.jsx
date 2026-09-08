import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./jiuri-horizon.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、；：,.!?;:\s]/g, "");

export function JiuriHorizonPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") { setDetail(null); setStudy(null); setHistory(false); }
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
    } catch { /* Learning remains usable if localStorage is blocked. */ }
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
    <main className="jiuri-page">
      <img className="jiuri-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="jiuri-shade" aria-hidden="true" />

      <header className="jiuri-header">
        <a href="#" onClick={(event) => event.preventDefault()} className="jiuri-brand">
          <strong>每日古诗文</strong><span>秋声 · 客思</span>
        </a>
        <div><span>2026 / 09 / 09</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="jiuri-stage" aria-labelledby="jiuri-title">
        <div className="jiuri-title-block">
          <p>{poem.form}</p>
          <h1 id="jiuri-title">{poem.title}</h1>
          <span>{poem.dynasty} · {poem.author}</span>
          <small>从归雁横秋，到宴席声色，再回到斜阳寒鸦。</small>
        </div>

        <ol className="jiuri-score" aria-label="逐段阅读">
          {poem.lines.map((line, index) => (
            <li key={line} className={activeLine === index ? "is-active" : ""}>
              <button onClick={() => setActiveLine(index)} aria-current={activeLine === index ? "step" : undefined}>
                <span>0{index + 1}</span><strong>{line}</strong><i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>

        <aside className="jiuri-note" aria-live="polite">
          <small>{activeLine < 2 ? "重阳 · 宴席" : "西风 · 天涯"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>0{activeLine + 1} / 04</span>
        </aside>
      </section>

      <nav className="jiuri-tools" aria-label="作品学习">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && (
        <aside className="jiuri-detail" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
          <button className="jiuri-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
          <section>
            <header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header>
            <p>{detail === "translation" ? poem.translation : poem.appreciation}</p>
          </section>
        </aside>
      )}

      {study && (
        <div className="jiuri-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="jiuri-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="jiuri-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到秋山</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="jiuri-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 段</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "遮住原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一层秋景"}</button></div>
              </div>
            ) : (
              <div className="jiuri-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1}</span><textarea value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
                <button className="jiuri-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`jiuri-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author} · {item.genre || "诗"}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
