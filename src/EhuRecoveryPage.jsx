import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./ehu-recovery.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stages = ["初凉", "染景", "自解", "止步"];

export function EhuRecoveryPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); }
      if (panel || study || history) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") setActive((value) => Math.max(value - 1, 0));
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
    <main className="ehu-page">
      <section className="ehu-hero" aria-labelledby="ehu-title">
        <img src={poem.image} alt="" aria-hidden="true" />
        <div className="ehu-veil" aria-hidden="true" />
        <header className="ehu-topbar">
          <a href="#ehu-recovery"><strong>每日古诗文</strong><span>晚来云收，楼梯止于一步</span></a>
          <button onClick={() => setHistory(true)}>往日篇章</button>
        </header>
        <div className="ehu-title-block">
          <small>2026.09.22 · {poem.dynasty} · {poem.genre}</small>
          <h1 id="ehu-title">{poem.title}</h1>
          <p>{poem.author}<span>{poem.form}</span></p>
        </div>
        <div className="ehu-watermark" aria-hidden="true"><span>水</span><i /><span>楼</span></div>
      </section>

      <section className="ehu-reading" aria-label="四层词意阅读">
        <header className="ehu-reading-head">
          <div><small>四层收景</small><h2>景物渐静，身体先说出答案</h2></div>
          <p>点击任一层，或用方向键沿词意移动。</p>
        </header>

        <div className="ehu-folds">
          <div className="ehu-lines" role="list" aria-label="词作原文四段">
            {poem.lines.map((line, index) => (
              <button
                key={stages[index]}
                role="listitem"
                className={`ehu-line ehu-line-${index + 1} ${active === index ? "is-active" : ""}`}
                onClick={() => setActive(index)}
                aria-current={active === index ? "step" : undefined}
              >
                <span><b>{String(index + 1).padStart(2, "0")}</b>{stages[index]}</span>
                <p>{line}</p>
              </button>
            ))}
          </div>

          <aside className="ehu-margin-note" aria-live="polite">
            <div className="ehu-note-index"><span>{String(active + 1).padStart(2, "0")}</span><i /></div>
            <small>岸边批注 · {stages[active]}</small>
            <h3>{poem.notes[active].term}</h3>
            <p>{poem.notes[active].text}</p>
            <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
              {active === poem.lines.length - 1 ? "停在楼下" : "再收一层景"}
            </button>
          </aside>

          <div className={`ehu-stair ehu-stair-${active + 1}`} aria-hidden="true">
            <span /><span /><span /><span />
            <em>{active === 3 ? "止" : "上"}</em>
          </div>
        </div>

        <nav className="ehu-tools" aria-label="学习工具">
          <button onClick={() => setPanel("translation")}>今译</button>
          <button onClick={() => setPanel("appreciation")}>赏析</button>
          <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
          <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        </nav>
      </section>

      {panel && <div className="ehu-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
        <button className="ehu-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
        <section className="ehu-sheet">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)}>关闭</button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
          {panel === "appreciation" && <footer>景由人染，病由身证。</footer>}
        </section>
      </div>}

      {study && <div className="ehu-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
        <button className="ehu-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
        <section className="ehu-study-sheet">
          <header><button onClick={() => setStudy(null)}>返回水岸</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
          {study === "recitation" ? <div className="ehu-recite">
            <small>{stages[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一层"}</button></div>
          </div> : <div className="ehu-dictation">
            <h2>{poem.studyCopy.dictationTitle}</h2>
            {poem.lines.map((line, index) => {
              const correct = normalize(answers[index]) === normalize(line);
              return <label key={stages[index]}><span>{String(index + 1).padStart(2, "0")} · {stages[index]}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一层" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
            })}
            {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 段，继续核对。`}</p>}
            <button className="ehu-check" onClick={checkDictation}>核对默写</button>
          </div>}
        </section>
      </div>}

      <aside className={`ehu-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)}>关闭</button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
      </aside>
    </main>
  );
}
