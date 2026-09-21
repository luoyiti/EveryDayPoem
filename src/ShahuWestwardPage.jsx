import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./shahu-westward.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stops = ["沙湖", "麻桥", "纸谈", "清泉", "西流"];

export function ShahuWestwardPage({ poem, onNavigate }) {
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
    } catch { /* optional */ }
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
    <main className="shahu-page">
      <section className="shahu-hero" aria-labelledby="shahu-title">
        <img src={poem.image} alt="" aria-hidden="true" />
        <div className="shahu-hero-shade" aria-hidden="true" />
        <header className="shahu-topbar">
          <a href="#you-shahu-westward"><strong>每日古诗文</strong><span>病从沙湖起，水向西边去</span></a>
          <button onClick={() => setHistory(true)}>往日篇章</button>
        </header>
        <div className="shahu-title-block">
          <small>2026.09.22 · {poem.dynasty} · {poem.genre}</small>
          <h1 id="shahu-title">{poem.title}</h1>
          <p>{poem.author}<span>{poem.form}</span></p>
        </div>
        <div className="shahu-direction" aria-hidden="true"><span>沙湖</span><i /><b>西</b></div>
      </section>

      <section className="shahu-route" aria-label="沿游踪阅读全文">
        <header className="shahu-route-head">
          <div><small>五站游踪</small><h2>从一场病，走到一条向西的水</h2></div>
          <p>点击路标或使用方向键。原文沿行程推进，边注停在当前一站。</p>
        </header>

        <div className="shahu-route-grid">
          <div className="shahu-itinerary" role="list" aria-label="游沙湖原文五段">
            {poem.lines.map((line, index) => (
              <button
                key={stops[index]}
                className={`shahu-stop ${active === index ? "is-active" : ""}`}
                onClick={() => setActive(index)}
                role="listitem"
                aria-current={active === index ? "step" : undefined}
              >
                <span className="shahu-stop-dot" aria-hidden="true" />
                <span className="shahu-stop-meta"><b>{String(index + 1).padStart(2, "0")}</b>{stops[index]}</span>
                <p>{line}</p>
              </button>
            ))}
          </div>

          <aside className="shahu-fieldnote" aria-live="polite">
            <small>路旁笺记 · {stops[active]}</small>
            <h3>{poem.notes[active].term}</h3>
            <p>{poem.notes[active].text}</p>
            <div className="shahu-flow-mark" aria-hidden="true"><span>常势</span><i /><b>向西</b></div>
            <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
              {active === poem.lines.length - 1 ? "停在兰溪" : "继续沿路"}
            </button>
          </aside>
        </div>

        <nav className="shahu-tools" aria-label="学习工具">
          <button onClick={() => setPanel("translation")}>今译</button>
          <button onClick={() => setPanel("appreciation")}>赏析</button>
          <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
          <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        </nav>
      </section>

      {panel && <div className="shahu-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
        <button className="shahu-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
        <section className="shahu-sheet">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)}>关闭</button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
          {panel === "appreciation" && <footer>耳不能听，水却能西；两种反常，写成一种开阔。</footer>}
        </section>
      </div>}

      {study && <div className="shahu-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
        <button className="shahu-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
        <section className="shahu-study-sheet">
          <header><button onClick={() => setStudy(null)}>返回游踪</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
          {study === "recitation" ? <div className="shahu-recite">
            <small>{stops[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}><span>{poem.lines[reciteIndex]}</span></button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一站"}</button></div>
          </div> : <div className="shahu-dictation">
            <h2>{poem.studyCopy.dictationTitle}</h2>
            {poem.lines.map((line, index) => {
              const correct = normalize(answers[index]) === normalize(line);
              return <label key={stops[index]}><span>{String(index + 1).padStart(2, "0")} · {stops[index]}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一站" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
            })}
            {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 段，继续核对。`}</p>}
            <button className="shahu-check" onClick={checkDictation}>核对默写</button>
          </div>}
        </section>
      </div>}

      <aside className={`shahu-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)}>关闭</button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
      </aside>
    </main>
  );
}
