import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./autumn-brothers.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、\s]/g, "");

export function AutumnBrothersPage({ poem, onNavigate }) {
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
      if (event.key === "Escape") {
        setStudy(null);
        setHistory(false);
        setPanel("annotation");
      }
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
    } catch { /* Keep study usable when storage is blocked. */ }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      markComplete("recitation");
      setStudy(null);
      return;
    }
    setReciteIndex((index) => index + 1);
    setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  const lineButton = (line, index) => (
    <button
      key={line}
      className={activeLine === index ? "is-active" : ""}
      onClick={() => { setActiveLine(index); setPanel("annotation"); }}
      aria-current={activeLine === index ? "step" : undefined}
    >
      <small>{String(index + 1).padStart(2, "0")}</small>
      <strong>{line}</strong>
    </button>
  );

  return (
    <main className="brothers-page">
      <img className="brothers-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="brothers-vignette" aria-hidden="true" />

      <header className="brothers-header">
        <a href="#" onClick={(event) => event.preventDefault()} className="brothers-brand">
          <strong>每日古诗文</strong><span>同夜 · 两地</span>
        </a>
        <div><span>2026 / 09 / 05</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="brothers-stage" aria-labelledby="brothers-title">
        <div className="brothers-title">
          <p>新秋 · 星河 · 空斋</p>
          <h1 id="brothers-title">{poem.title}</h1>
          <span>{poem.dynasty} · {poem.author}</span>
          <small>前四句从两地共望收回一间空斋，后四句再由家人之思转入民事、病体与年华。</small>
        </div>

        <div className="brothers-skyline" aria-hidden="true"><i /><span>共望一河</span><i /></div>

        <div className="brothers-verses">
          <section className="brothers-distance" aria-label="两地与归思">
            <small>远 · 星河</small>
            {poem.lines.slice(0, 4).map((line, index) => lineButton(line, index))}
          </section>
          <section className="brothers-duty" aria-label="人瘼与年华">
            <small>近 · 空斋</small>
            {poem.lines.slice(4).map((line, offset) => lineButton(line, offset + 4))}
          </section>
        </div>

        <aside className="brothers-note" aria-live="polite">
          <small>{activeLine < 4 ? "望远 · 收回" : "自持 · 收束"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>{String(activeLine + 1).padStart(2, "0")} / 08</span>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="brothers-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="brothers-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="brothers-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="brothers-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="brothers-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到星河</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="brothers-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button></div>
              </div>
            ) : (
              <div className="brothers-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                <div className="brothers-answer-grid">
                  {poem.lines.map((line, index) => {
                    const correct = normalize(answers[index]) === normalize(line);
                    return <label key={line}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                  })}
                </div>
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="brothers-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`brothers-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
