import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Eye, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./chenzhou-mist.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const markers = ["失", "望", "闭", "寄", "砌", "流"];
const phases = ["雾里", "远望", "孤馆", "音信", "离恨", "问江"];

export function ChenzhouMistPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [veiled, setVeiled] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setDetail(null); setStudy(null); setHistory(false); }
      if (!study && !history && ["ArrowDown", "ArrowRight"].includes(event.key)) setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (!study && !history && ["ArrowUp", "ArrowLeft"].includes(event.key)) setActive((value) => Math.max(value - 1, 0));
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
    } catch { /* Keep study interactions usable without storage. */ }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((value) => value + 1);
    setVeiled(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="cz-page" style={{ "--active-step": active }}>
      <img className="cz-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="cz-fog" aria-hidden="true" />
      <div className="cz-river" aria-hidden="true" />

      <header className="cz-header">
        <a className="cz-brand" href="#tashaxing-chenzhou-mist" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong><span>雾里失路 · 江上问流</span>
        </a>
        <div><span>2026.09.19 · {poem.dynasty} · {poem.genre}</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="cz-stage" aria-labelledby="cz-title">
        <aside className="cz-title-block">
          <small>{poem.form}</small>
          <h1 id="cz-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="cz-visibility" aria-hidden="true"><span>可见</span><i /><span>迷失</span></div>
        </aside>

        <div className="cz-route" aria-label="原文六层阅读">
          <div className="cz-route-line" aria-hidden="true" />
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`cz-line cz-line-${index + 1} ${active === index ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-current={active === index ? "step" : undefined}
            >
              <span className="cz-marker">{markers[index]}</span>
              <span className="cz-line-copy"><small>0{index + 1} · {phases[index]}</small><strong>{line}</strong></span>
            </button>
          ))}
        </div>

        <aside className="cz-note" aria-live="polite">
          <div className="cz-note-index"><span>雾中注脚</span><b>0{active + 1}</b></div>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
            {active === poem.lines.length - 1 ? "已到郴江" : "沿水再走一步 →"}
          </button>
        </aside>
      </section>

      <nav className="cz-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setVeiled(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <aside className="cz-detail" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
        <button className="cz-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section><header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header><p>{detail === "translation" ? poem.translation : poem.appreciation}</p></section>
      </aside>}

      {study && <div className="cz-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="cz-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="cz-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到雾中</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? <div className="cz-recite">
            <small>{phases[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={veiled ? "is-veiled" : ""} onClick={() => setVeiled((value) => !value)} aria-label={veiled ? "显出原文" : "覆去原文"}>
              <Eye size={18} /><span>{poem.lines[reciteIndex]}</span>
            </button>
            <p>{veiled ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setVeiled((value) => !value)}>{veiled ? "拨开雾层" : "覆上雾层"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "继续沿江"}</button></div>
          </div>
          : <div className="cz-dictation"><h2>{poem.studyCopy.dictationTitle}</h2>{poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={line}><span>{markers[index]} · {phases[index]}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一层" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>; })}{checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}<button className="cz-submit" onClick={checkDictation}>核对默写</button></div>}
        </section>
      </div>}

      <aside className={`cz-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
