import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./danyang-lake.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’\s]/g, "");

export function DanyangLakePage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); }
      if (!study && !history && event.key === "ArrowRight") setActive((value) => (value + 1) % poem.lines.length);
      if (!study && !history && event.key === "ArrowLeft") setActive((value) => (value - 1 + poem.lines.length) % poem.lines.length);
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
    } catch { /* Keep the study flow usable without persistent storage. */ }
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
    <main className="danyang-page">
      <img className="danyang-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="danyang-wash" aria-hidden="true" />

      <header className="danyang-header">
        <a className="danyang-mark" href="#danyang-lake-breeze" aria-label="每日古诗文首页">
          <span>每日</span><strong>古诗文</strong>
        </a>
        <div className="danyang-meta"><span>2026.09.12 · {poem.dynasty} · {poem.genre}</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="danyang-hero" aria-labelledby="danyang-title">
        <div className="danyang-title-block">
          <small>{poem.form} · 春湖重来</small>
          <h1 id="danyang-title">西江月</h1>
          <p>问讯湖边春色</p>
          <span>{poem.author}</span>
        </div>

        <div className="danyang-waterline" aria-label="沿湖逐段阅读">
          <i aria-hidden="true" />
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={active === index ? "is-active" : ""}
              onClick={() => { setActive(index); setPanel(null); }}
              aria-current={active === index ? "step" : undefined}
            >
              <span>0{index + 1}</span><strong>{line}</strong>
            </button>
          ))}
        </div>

        <aside className="danyang-note" aria-live="polite">
          <div><span>湖上札记</span><b>0{active + 1}</b></div>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <button onClick={() => setActive((active + 1) % poem.lines.length)}>沿水下一段 →</button>
        </aside>

        <p className="danyang-caption">东风推船，柳丝拂面；心境从世路中退向水天。</p>
      </section>

      <nav className="danyang-tools" aria-label="作品学习工具">
        <button className={!panel ? "is-active" : ""} onClick={() => setPanel(null)}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {panel && (
        <aside className="danyang-panel" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)} aria-label="关闭"><X size={18} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      {study && (
        <div className="danyang-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="danyang-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="danyang-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到湖上</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="danyang-recite">
                <small>沿湖而行 · {reciteIndex + 1} / {poem.lines.length}</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "让原句入水"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "继续行舟"}</button></div>
              </div>
            ) : (
              <div className="danyang-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>0{index + 1}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
                <button className="danyang-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`danyang-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
