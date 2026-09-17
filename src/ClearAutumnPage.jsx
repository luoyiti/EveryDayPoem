import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./clear-autumn.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const phases = [
  { mark: "澄", label: "爽节 · 云水", lines: [0, 1] },
  { mark: "清", label: "珠露 · 燕雁", lines: [2, 3] },
  { mark: "登", label: "绮阁 · 碧幔", lines: [4, 5] },
  { mark: "夜", label: "金波 · 余青", lines: [6, 7] },
];

export function ClearAutumnPage({ poem, onNavigate }) {
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
  const activePhase = phases.findIndex((phase) => phase.lines.includes(active));

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
    <main className="qf-page">
      <img className="qf-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="qf-wash" aria-hidden="true" />
      <div className="qf-silk qf-silk-one" aria-hidden="true" />
      <div className="qf-silk qf-silk-two" aria-hidden="true" />

      <header className="qf-header">
        <a className="qf-brand" href="#qiufu-clear-autumn" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong><span>从水色登向星汉，再落回河畔余青</span>
        </a>
        <div className="qf-meta">
          <span>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</span>
          <button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button>
        </div>
      </header>

      <section className="qf-stage" aria-labelledby="qf-title">
        <aside className="qf-title-block">
          <small>{poem.form}</small>
          <h1 id="qf-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="qf-key"><i />净 · 高 · 洁 · 澈</div>
        </aside>

        <div className="qf-verse-field" aria-label="由秋野登临星汉的八段阅读">
          <div className="qf-spine" aria-hidden="true"><span>秋</span><span>水</span><span>阁</span><span>夜</span></div>
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`qf-line qf-line-${index + 1} ${active === index ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-current={active === index ? "step" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{line}</p>
            </button>
          ))}
        </div>

        <aside className="qf-note" aria-live="polite">
          <small>{phases[activePhase]?.label}</small>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <span>{String(active + 1).padStart(2, "0")} / {String(poem.lines.length).padStart(2, "0")}</span>
        </aside>

        <nav className="qf-phases" aria-label="秋景层次">
          {phases.map((phase, index) => (
            <button key={phase.mark} className={activePhase === index ? "is-active" : ""} onClick={() => setActive(phase.lines[0])}>
              <b>{phase.mark}</b><span>{phase.label}</span>
            </button>
          ))}
        </nav>
      </section>

      <nav className="qf-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <aside className="qf-layer" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
        <button className="qf-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section className="qf-reading-sheet">
          <header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header>
          <p>{detail === "translation" ? poem.translation : poem.appreciation}</p>
        </section>
      </aside>}

      {study && <div className="qf-layer" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="qf-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="qf-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到秋夜</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? (
            <div className="qf-recite">
              <small>{phases.find((phase) => phase.lines.includes(reciteIndex))?.mark} · {reciteIndex + 1} / {poem.lines.length}</small>
              <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
              <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
              <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "覆去原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "沿时序继续"}</button></div>
            </div>
          ) : (
            <div className="qf-dictation">
              <h2>{poem.studyCopy.dictationTitle}</h2>
              {poem.lines.map((line, index) => {
                const correct = normalize(answers[index]) === normalize(line);
                return <label key={line}><span>{String(index + 1).padStart(2, "0")} · {poem.notes[index].term}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>;
              })}
              {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
              <button className="qf-submit" onClick={checkDictation}>核对默写</button>
            </div>
          )}
        </section>
      </div>}

      <aside className={`qf-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
