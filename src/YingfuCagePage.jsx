import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./yingfu-cage.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stages = ["笼", "暮", "晨", "同"];
const stageSub = ["堂隅高悬", "日暮独宿", "群鸣在外", "同时异忧"];

export function YingfuCagePage({ poem, onNavigate }) {
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
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); return; }
      if (panel || study || history) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") setActive((v) => Math.min(v + 1, poem.lines.length - 1));
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") setActive((v) => Math.max(v - 1, 0));
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
    setReciteIndex((v) => v + 1);
    setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="yingfu-page">
      <section className="yingfu-hero" aria-labelledby="yingfu-title">
        <img className="yingfu-hero-image" src={poem.image} alt="" aria-hidden="true" />
        <div className="yingfu-hero-shade" aria-hidden="true" />
        <header className="yingfu-topbar">
          <a href="#yingfu-caged-oriole"><strong>每日古诗文</strong><span>一笼之内 · 一春之外</span></a>
          <button onClick={() => setHistory(true)}>往日篇章</button>
        </header>
        <div className="yingfu-title-block">
          <small>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</small>
          <h1 id="yingfu-title">{poem.title}</h1>
          <p>{poem.author}<span>{poem.form}</span></p>
        </div>
        <div className="yingfu-thesis">
          <span>同一春晨</span>
          <b>笼内独宿</b>
          <i aria-hidden="true" />
          <b>檐外群鸣</b>
        </div>
      </section>

      <section className="yingfu-reading" aria-label="阅读全文与逐段注释">
        <header className="yingfu-reading-head">
          <div><small>四次明暗转换</small><h2>从高悬的笼，到屋外的群鸣</h2></div>
          <p>原文保持在中轴；点击“笼、暮、晨、同”切换边注，也可使用方向键。</p>
        </header>

        <div className="yingfu-reading-grid">
          <nav className="yingfu-stage-rail" aria-label="原文四层">
            {stages.map((stage, index) => (
              <button key={stage} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
                <b>{stage}</b><span>{stageSub[index]}</span>
              </button>
            ))}
          </nav>

          <div className="yingfu-original" role="list" aria-label="莺赋原文">
            {poem.lines.map((line, index) => (
              <button key={index} role="listitem" className={active === index ? "is-active" : ""} onClick={() => setActive(index)}>
                <small>{String(index + 1).padStart(2, "0")} · {stages[index]}</small>
                <p>{line}</p>
              </button>
            ))}
          </div>

          <aside className="yingfu-note" aria-live="polite">
            <small>笼外笺记 · {stageSub[active]}</small>
            <h3>{poem.notes[active].term}</h3>
            <p>{poem.notes[active].text}</p>
            <div className="yingfu-contrast" aria-hidden="true">
              <span>{active < 2 ? "暗" : "明"}</span><i /><b>{active === 3 ? "异忧" : stages[active]}</b>
            </div>
            <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
              {active === poem.lines.length - 1 ? "停在同时异忧" : "向下一层"}
            </button>
          </aside>
        </div>

        <nav className="yingfu-tools" aria-label="学习工具">
          <button onClick={() => setPanel("translation")}>今译</button>
          <button onClick={() => setPanel("appreciation")}>赏析</button>
          <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
          <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        </nav>
      </section>

      {panel && <div className="yingfu-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
        <button className="yingfu-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
        <section className="yingfu-sheet">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)}>关闭</button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
          {panel === "appreciation" && <footer>同一时节，不同处境；全篇的力量落在“同时异忧”。</footer>}
        </section>
      </div>}

      {study && <div className="yingfu-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
        <button className="yingfu-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
        <section className="yingfu-study-sheet">
          <header><button onClick={() => setStudy(null)}>返回原文</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
          {study === "recitation" ? <div className="yingfu-recite">
            <small>{stageSub[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((v) => !v)}><span>{poem.lines[reciteIndex]}</span></button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((v) => !v)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一层"}</button></div>
          </div> : <div className="yingfu-dictation">
            <h2>{poem.studyCopy.dictationTitle}</h2>
            {poem.lines.map((line, index) => {
              const correct = normalize(answers[index]) === normalize(line);
              return <label key={index}><span>{String(index + 1).padStart(2, "0")} · {stageSub[index]}</span><textarea rows={3} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一层" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>;
            })}
            {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 段，继续核对。`}</p>}
            <button className="yingfu-check" onClick={checkDictation}>核对默写</button>
          </div>}
        </section>
      </div>}

      <aside className={`yingfu-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)}>关闭</button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
      </aside>
    </main>
  );
}
