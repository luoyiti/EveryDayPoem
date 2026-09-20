import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./cold-spring-pavilion.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const sectionNames = ["入亭", "春夏", "近水", "洗尘", "五亭", "述作"];

export function ColdSpringPavilionPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(null);
  const [history, setHistory] = useState(false);
  const [study, setStudy] = useState(null);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); }
      if (!panel && !study && !history && event.key === "ArrowDown") setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (!panel && !study && !history && event.key === "ArrowUp") setActive((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, panel, poem.lines.length, study]);

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
    } catch { /* localStorage is optional */ }
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
    <main className="csp-page">
      <section className="csp-hero" aria-labelledby="csp-title">
        <img src={poem.image} alt="" aria-hidden="true" />
        <div className="csp-hero-shade" aria-hidden="true" />
        <header className="csp-topbar">
          <a href="#cold-spring-pavilion"><strong>每日古诗文</strong><span>山树为盖 · 泉水与阶平</span></a>
          <button onClick={() => setHistory(true)}>往日篇章</button>
        </header>
        <div className="csp-heading">
          <small>2026.09.21 · {poem.dynasty} · {poem.genre}</small>
          <h1 id="csp-title">{poem.title}</h1>
          <p>{poem.author}<span>{poem.form}</span></p>
        </div>
        <div className="csp-watermark" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="csp-reading" aria-label="原文与逐段注解">
        <aside className="csp-gauge">
          <small>一亭六层</small>
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span>{sectionNames[active]}</span>
          <div>{poem.lines.map((_, index) => <button key={index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`第${index + 1}段 ${sectionNames[index]}`} />)}</div>
        </aside>

        <div className="csp-stream">
          {poem.lines.map((line, index) => (
            <article key={sectionNames[index]} className={`csp-step csp-step-${index + 1} ${active === index ? "is-active" : ""}`}>
              <button onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
                <span><b>{String(index + 1).padStart(2, "0")}</b>{sectionNames[index]}</span>
                <p>{line}</p>
              </button>
            </article>
          ))}
        </div>

        <aside className="csp-note" aria-live="polite">
          <small>泉边注脚</small>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
            {active === poem.lines.length - 1 ? "已至亭记落款" : "循泉下一段"}
          </button>
        </aside>
      </section>

      <nav className="csp-actions" aria-label="学习工具">
        <button onClick={() => setPanel("translation")}>今译</button>
        <button onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {panel && <div className="csp-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
        <button className="csp-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
        <section className="csp-sheet"><header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)} aria-label="关闭">×</button></header><p>{panel === "translation" ? poem.translation : poem.appreciation}</p></section>
      </div>}

      {study && <div className="csp-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
        <button className="csp-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
        <section className="csp-study-sheet">
          <header><button onClick={() => setStudy(null)}>← 返回冷泉亭</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
          {study === "recitation" ? <div className="csp-recite">
            <small>{sectionNames[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一层"}</button></div>
          </div> : <div className="csp-dictation">
            <h2>{poem.studyCopy.dictationTitle}</h2>
            {poem.lines.map((line, index) => {
              const correct = normalize(answers[index]) === normalize(line);
              return <label key={sectionNames[index]}><span>{String(index + 1).padStart(2, "0")} · {sectionNames[index]}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
            })}
            {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 段，继续核对。`}</p>}
            <button className="csp-check" onClick={checkDictation}>核对默写</button>
          </div>}
        </section>
      </div>}

      <aside className={`csp-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭">×</button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
      </aside>
    </main>
  );
}
