import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./lushan-mountain.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stops = ["入山", "转峰", "霜林", "闻鸡"];

export function LushanMountainPage({ poem, onNavigate }) {
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
      if (!panel && !study && !history && event.key === "ArrowRight") setActive((value) => Math.min(value + 1, poem.lines.length - 1));
      if (!panel && !study && !history && event.key === "ArrowLeft") setActive((value) => Math.max(value - 1, 0));
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
    <main className="lushan-page">
      <section className="lushan-landscape" aria-labelledby="lushan-title">
        <img src={poem.image} alt="" aria-hidden="true" />
        <div className="lushan-image-shade" aria-hidden="true" />
        <header className="lushan-topbar">
          <a href="#lushan-mountain-walk"><strong>每日古诗文</strong><span>沿山径，见峰转，听云外一声</span></a>
          <button onClick={() => setHistory(true)}>往日篇章</button>
        </header>
        <div className="lushan-heading">
          <small>2026.09.21 · {poem.dynasty} · {poem.genre}</small>
          <h1 id="lushan-title">{poem.title}</h1>
          <p>{poem.author}<span>{poem.form}</span></p>
        </div>
        <div className="lushan-distance" aria-hidden="true"><span>近</span><i /><span>远</span></div>
      </section>

      <section className="lushan-reading" aria-label="沿山径阅读原文">
        <header className="lushan-reading-head">
          <div><small>四步入山</small><h2>景物不在原地等你</h2></div>
          <p>用左右方向键，或点击山径上的四个停点。</p>
        </header>

        <div className="lushan-trail" role="list" aria-label="四联原文">
          <div className="lushan-trail-line" aria-hidden="true" />
          {poem.lines.map((line, index) => (
            <button
              key={stops[index]}
              role="listitem"
              className={`lushan-stop lushan-stop-${index + 1} ${active === index ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-current={active === index ? "step" : undefined}
            >
              <span><b>{String(index + 1).padStart(2, "0")}</b>{stops[index]}</span>
              <p>{line}</p>
            </button>
          ))}
        </div>

        <aside className="lushan-note" aria-live="polite">
          <div><small>此处山势</small><strong>{stops[active]}</strong></div>
          <h3>{poem.notes[active].term}</h3>
          <p>{poem.notes[active].text}</p>
          {active === poem.lines.length - 1 && <em>云外 · 一声鸡</em>}
          <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
            {active === poem.lines.length - 1 ? "山径至此" : "再行一步"}
          </button>
        </aside>

        <nav className="lushan-actions" aria-label="学习工具">
          <button onClick={() => setPanel("translation")}>今译</button>
          <button onClick={() => setPanel("appreciation")}>赏析</button>
          <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
          <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        </nav>
      </section>

      {panel && <div className="lushan-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
        <button className="lushan-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
        <section className="lushan-sheet">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)}>关闭</button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </section>
      </div>}

      {study && <div className="lushan-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
        <button className="lushan-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
        <section className="lushan-study-sheet">
          <header><button onClick={() => setStudy(null)}>返回山径</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
          {study === "recitation" ? <div className="lushan-recite">
            <small>{stops[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一联"}</button></div>
          </div> : <div className="lushan-dictation">
            <h2>{poem.studyCopy.dictationTitle}</h2>
            {poem.lines.map((line, index) => {
              const correct = normalize(answers[index]) === normalize(line);
              return <label key={stops[index]}><span>{String(index + 1).padStart(2, "0")} · {stops[index]}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一联" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
            })}
            {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 联，继续核对。`}</p>}
            <button className="lushan-check" onClick={checkDictation}>核对默写</button>
          </div>}
        </section>
      </div>}

      <aside className={`lushan-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)}>关闭</button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
      </aside>
    </main>
  );
}
