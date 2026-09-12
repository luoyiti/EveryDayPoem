import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./youxi-stream.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stageNames = ["见溪", "观流", "惜溪", "题名"];

export function YouxiStreamPage({ poem, onNavigate }) {
  const [stage, setStage] = useState(0);
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
      if (!study && !history && ["ArrowDown", "ArrowRight"].includes(event.key)) setStage((value) => (value + 1) % poem.lines.length);
      if (!study && !history && ["ArrowUp", "ArrowLeft"].includes(event.key)) setStage((value) => (value - 1 + poem.lines.length) % poem.lines.length);
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
    } catch { /* Study remains usable without persistent storage. */ }
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
    <main className="youxi-page">
      <img className="youxi-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="youxi-shade" aria-hidden="true" />

      <header className="youxi-header">
        <a className="youxi-mark" href="#youxi-clearing" aria-label="每日古诗文首页"><span>每日</span><strong>古诗文</strong></a>
        <div className="youxi-meta"><span>2026.09.13 · {poem.dynasty} · {poem.genre}</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="youxi-layout" aria-labelledby="youxi-title">
        <aside className="youxi-inscription">
          <small>{poem.form} · 从无名到刻石</small>
          <h1 id="youxi-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="youxi-route" aria-label="溪程阅读进度">
            {stageNames.map((name, index) => <button key={name} className={stage === index ? "is-active" : ""} onClick={() => setStage(index)}><i /> <span>0{index + 1}</span><strong>{name}</strong></button>)}
          </div>
        </aside>

        <article className="youxi-stream" aria-label="原文沿溪阅读">
          {poem.lines.map((line, index) => (
            <button key={line} className={`youxi-passage youxi-passage-${index + 1} ${stage === index ? "is-active" : ""}`} onClick={() => { setStage(index); setPanel(null); }} aria-current={stage === index ? "step" : undefined}>
              <span>{stageNames[index]}</span><p>{line}</p>
            </button>
          ))}
        </article>

        <aside className="youxi-margin" aria-live="polite">
          <div><span>溪上札记</span><b>0{stage + 1}</b></div>
          <h2>{poem.notes[stage].term}</h2>
          <p>{poem.notes[stage].text}</p>
          <button onClick={() => setStage((stage + 1) % poem.lines.length)}>循水下一段 →</button>
        </aside>
      </section>

      <nav className="youxi-tools" aria-label="作品学习工具">
        <button className={!panel ? "is-active" : ""} onClick={() => setPanel(null)}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {panel && <aside className="youxi-panel" aria-live="polite"><header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)} aria-label="关闭"><X size={18} /></button></header><p>{panel === "translation" ? poem.translation : poem.appreciation}</p></aside>}

      {study && <div className="youxi-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="youxi-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="youxi-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到溪上</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? <div className="youxi-recite"><small>{stageNames[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small><button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button><p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p><div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "覆去原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "循溪继续"}</button></div></div>
          : <div className="youxi-dictation"><h2>{poem.studyCopy.dictationTitle}</h2>{poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={line}><span>{stageNames[index]}</span><textarea rows={4} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>; })}{checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}<button className="youxi-submit" onClick={checkDictation}>核对默写</button></div>}
        </section>
      </div>}

      <aside className={`youxi-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
