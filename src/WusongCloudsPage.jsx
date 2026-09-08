import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./wusong-clouds.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’\s]/g, "");

export function WusongCloudsPage({ poem, onNavigate }) {
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
    const onKey = (event) => {
      if (event.key === "Escape") { setDetail(null); setStudy(null); setHistory(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    } catch { /* The study flow still works when storage is unavailable. */ }
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
    <main className="wusong-page">
      <img className="wusong-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="wusong-weather" aria-hidden="true" />

      <header className="wusong-header">
        <div className="wusong-brand"><strong>每日古诗文</strong><span>吴松 · 黄昏</span></div>
        <div className="wusong-date"><span>2026 / 09 / 09</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="wusong-stage" aria-labelledby="wusong-title">
        <div className="wusong-title-block">
          <small>{poem.dynasty} · {poem.genre} · {poem.form}</small>
          <h1 id="wusong-title">点绛唇</h1>
          <p>丁未冬过吴松作</p>
          <span>{poem.author}</span>
        </div>

        <div className="wusong-air" aria-label="随云逐句阅读">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`wusong-verse verse-${index + 1} ${activeLine === index ? "is-active" : ""}`}
              onClick={() => { setActiveLine(index); setDetail(null); }}
              aria-current={activeLine === index ? "step" : undefined}
            >
              <span>0{index + 1}</span>
              <strong>{line}</strong>
            </button>
          ))}
        </div>

        <aside className="wusong-gloss" aria-live="polite">
          <small>{activeLine < 2 ? "云上 · 将雨" : "桥边 · 怀古"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>0{activeLine + 1} / 04</span>
        </aside>

        <div className="wusong-turn" aria-hidden="true"><i /><span>随云去</span><b>今何许</b></div>
      </section>

      <nav className="wusong-tools" aria-label="作品学习工具">
        <button className={!detail ? "is-active" : ""} onClick={() => setDetail(null)}>注释</button>
        <button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button>
        <button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && (
        <aside className="wusong-detail" aria-live="polite">
          <header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header>
          <p>{detail === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      {study && (
        <div className="wusong-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="wusong-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="wusong-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到湖岸</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="wusong-recite">
                <small>随云而行 · {reciteIndex + 1} / {poem.lines.length}</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "让原句入云"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "沿云下一句"}</button></div>
              </div>
            ) : (
              <div className="wusong-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>0{index + 1}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
                <button className="wusong-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`wusong-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
