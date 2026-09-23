import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./jiangnan-water.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stages = ["烟", "鸥", "舟", "爱"];
const stageSub = ["远景入江", "秋光生动", "香风来舟", "一语收心"];

export function JiangnanWaterPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setPanel(null); setStudy(null); setHistory(false); return; }
      if (panel || study || history) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") setActive((v) => Math.min(v + 1, poem.lines.length - 1));
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActive((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history, panel, poem.lines.length, study]);

  const score = useMemo(() => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length, [answers, poem.lines]);

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...previous, [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() } }));
    } catch { /* optional */ }
  }
  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) { markComplete("recitation"); setStudy(null); return; }
    setReciteIndex((v) => v + 1); setHidden(false);
  }
  function checkDictation() { setChecked(true); if (score === poem.lines.length) markComplete("dictation"); }

  return <main className="jn-page">
    <section className="jn-hero" aria-labelledby="jn-title">
      <img src={poem.image} alt="" aria-hidden="true" className="jn-image" />
      <div className="jn-shade" aria-hidden="true" />
      <header className="jn-topbar">
        <a href="#shuixianzi-jiangnan"><strong>每日古诗文</strong><span>烟水一程 · 江南一曲</span></a>
        <button onClick={() => setHistory(true)}>往日篇章</button>
      </header>
      <div className="jn-title">
        <small>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</small>
        <h1 id="jn-title">{poem.title}</h1>
        <p>{poem.author}<span>{poem.form}</span></p>
      </div>
      <div className="jn-waterline" aria-hidden="true"><i /><i /><i /><i /></div>
      <p className="jn-thesis">从一江烟水起笔，沿着芰荷、沙鸥、香风与画船一路向前，最后才把“爱”说出口。</p>
    </section>

    <section className="jn-reading" aria-label="原文与逐段注释">
      <header><div><small>四段水路</small><h2>景物先走，心意最后抵达</h2></div><p>点击水标切换原文与笺记；方向键同样可用。</p></header>
      <nav className="jn-route" aria-label="四段阅读路线">
        {stages.map((stage, index) => <button key={stage} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined}>
          <span>{String(index + 1).padStart(2, "0")}</span><b>{stage}</b><small>{stageSub[index]}</small>
        </button>)}
      </nav>
      <div className="jn-current">
        <article className="jn-verse" aria-live="polite"><small>{stageSub[active]}</small><p>{poem.lines[active]}</p><button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>{active === poem.lines.length - 1 ? "停在江南" : "顺水而下"}</button></article>
        <aside className="jn-note"><small>水边笺记</small><h3>{poem.notes[active].term}</h3><p>{poem.notes[active].text}</p></aside>
      </div>
      <div className="jn-fulltext" role="list" aria-label="水仙子咏江南全文">
        {poem.lines.map((line, index) => <button role="listitem" key={index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}><span>{stages[index]}</span><p>{line}</p></button>)}
      </div>
      <nav className="jn-tools" aria-label="学习工具">
        <button onClick={() => setPanel("translation")}>今译</button>
        <button onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>
    </section>

    {panel && <div className="jn-overlay" role="dialog" aria-modal="true" aria-label={panel === "translation" ? "今译" : "赏析"}>
      <button className="jn-scrim" onClick={() => setPanel(null)} aria-label="关闭" />
      <section className="jn-sheet"><header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel(null)}>关闭</button></header><p>{panel === "translation" ? poem.translation : poem.appreciation}</p>{panel === "appreciation" && <footer>先铺景，再让景动，最后一句“爱杀江南”才让观看者现身。</footer>}</section>
    </div>}

    {study && <div className="jn-overlay" role="dialog" aria-modal="true" aria-label={study === "recitation" ? "背诵" : "默写"}>
      <button className="jn-scrim" onClick={() => setStudy(null)} aria-label="关闭" />
      <section className="jn-study"><header><button onClick={() => setStudy(null)}>返回原文</button><span>{study === "recitation" ? "背诵" : "默写"}</span></header>
        {study === "recitation" ? <div className="jn-recite"><small>{stageSub[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small><button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((v) => !v)}><span>{poem.lines[reciteIndex]}</span></button><p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p><div><button onClick={() => setHidden((v) => !v)}>{hidden ? "显出原文" : "藏起原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一段"}</button></div></div>
        : <div className="jn-dictation"><h2>{poem.studyCopy.dictationTitle}</h2>{poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={index}><span>{String(index + 1).padStart(2, "0")} · {stageSub[index]}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />{checked && <small className={correct ? "is-correct" : "is-wrong"}>{correct ? "正确" : line}</small>}</label>; })}{checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} / ${poem.lines.length} 段，继续核对。`}</p>}<button className="jn-check" onClick={checkDictation}>核对默写</button></div>}
      </section>
    </div>}

    <aside className={`jn-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
      <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)}>关闭</button></header>
      <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></button>)}</div>
    </aside>
  </main>;
}
