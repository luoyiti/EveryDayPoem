import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Eye, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./dianjiangchun-gaze.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stages = [
  { mark: "雨", caption: "云雨 · 佳丽", distance: "近景" },
  { mark: "烟", caption: "水村 · 渔市", distance: "中景" },
  { mark: "鸿", caption: "天际 · 行缀", distance: "远景" },
  { mark: "睇", caption: "平生 · 凭栏", distance: "收心" },
];

export function DianjiangchunGazePage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState(false);
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setDetail(null); setHistory(false); setStudy(null); }
      if (detail || history || study) return;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) setActive((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, history, poem.lines.length, study]);

  const score = useMemo(() => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length, [answers, poem.lines]);

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...previous,
        [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() },
      }));
    } catch { /* Storage is optional. */ }
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
    <main className="dg-page">
      <img className="dg-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="dg-wash" aria-hidden="true" />

      <header className="dg-header">
        <a className="dg-brand" href="#dianjiangchun-rain-gaze" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong><span>沿一缕孤烟，把目光放到天际</span>
        </a>
        <div className="dg-header-meta">
          <span>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</span>
          <button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button>
        </div>
      </header>

      <section className="dg-stage" aria-labelledby="dg-title">
        <aside className="dg-title-block">
          <small>{poem.form}</small>
          <h1 id="dg-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="dg-weather"><i />雨歇 · 云低 · 水阔</div>
        </aside>

        <div className="dg-sightline" aria-label="由近及远的四层阅读">
          <div className="dg-horizon" aria-hidden="true" />
          {poem.lines.map((line, index) => (
            <button key={line} className={`dg-verse dg-verse-${index + 1} ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
              <span>{stages[index].distance}</span>
              <p>{line}</p>
            </button>
          ))}
        </div>

        <aside className="dg-focus" aria-live="polite">
          <div className="dg-focus-index"><Eye size={16} /><span>{String(active + 1).padStart(2, "0")} / 04</span></div>
          <small>{stages[active].caption}</small>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
        </aside>

        <nav className="dg-range" aria-label="视线层次">
          {stages.map((stage, index) => (
            <button key={stage.mark} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>
              <b>{stage.mark}</b><span>{stage.distance}</span>
            </button>
          ))}
        </nav>
      </section>

      <nav className="dg-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <aside className="dg-layer" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
        <button className="dg-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section className="dg-reading-sheet">
          <header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header>
          <p>{detail === "translation" ? poem.translation : poem.appreciation}</p>
        </section>
      </aside>}

      {study && <div className="dg-layer" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="dg-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="dg-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到水天</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? (
            <div className="dg-recite">
              <small>{stages[reciteIndex].mark} · {reciteIndex + 1} / {poem.lines.length}</small>
              <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
              <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
              <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "覆去原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "把视线推远"}</button></div>
            </div>
          ) : (
            <div className="dg-dictation">
              <h2>{poem.studyCopy.dictationTitle}</h2>
              {poem.lines.map((line, index) => {
                const correct = normalize(answers[index]) === normalize(line);
                return <label key={line}><span>{stages[index].mark} · {stages[index].caption}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一拍" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
              })}
              {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 拍，继续核对。`}</p>}
              <button className="dg-submit" onClick={checkDictation}>核对默写</button>
            </div>
          )}
        </section>
      </div>}

      <aside className={`dg-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
