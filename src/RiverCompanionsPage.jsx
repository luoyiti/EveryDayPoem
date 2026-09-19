import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Eye, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./river-companions.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const markers = ["黄白", "绿红", "无", "有", "鸥鹭", "侯", "叟"];
const phases = ["水岸", "滩头", "世交", "忘机", "秋江", "功名", "烟波"];
const swatches = ["#c9b76b", "#a66a58", "#8aa790", "#b9c8b0", "#d8e0da", "#9b8f7c", "#d1c8b2"];

export function RiverCompanionsPage({ poem, onNavigate }) {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(null);
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

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
    } catch { /* Study remains usable without storage. */ }
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
    <main className="rc-page" style={{ "--active-color": swatches[active] }}>
      <img className="rc-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="rc-wash" aria-hidden="true" />
      <div className="rc-ripple rc-ripple-a" aria-hidden="true" />
      <div className="rc-ripple rc-ripple-b" aria-hidden="true" />

      <header className="rc-header">
        <a className="rc-brand" href="#chenzui-yufu-autumn" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong><span>四色为岸 · 鸥鹭为友</span>
        </a>
        <div><span>2026.09.20 · {poem.dynasty} · {poem.genre}</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="rc-stage" aria-labelledby="rc-title">
        <aside className="rc-title-block">
          <small>{poem.form}</small>
          <h1 id="rc-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="rc-palette" aria-label="曲中四色">
            <i className="is-yellow" /><i className="is-white" /><i className="is-green" /><i className="is-red" />
            <span>黄芦 · 白蘋 · 绿杨 · 红蓼</span>
          </div>
        </aside>

        <div className="rc-current" aria-label="原文七层阅读">
          <div className="rc-current-line" aria-hidden="true" />
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`rc-line rc-line-${index + 1} ${active === index ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-current={active === index ? "step" : undefined}
            >
              <span className="rc-dot" style={{ "--dot": swatches[index] }} />
              <span className="rc-line-copy"><small>{markers[index]} · {phases[index]}</small><strong>{line}</strong></span>
            </button>
          ))}
        </div>

        <aside className="rc-note" aria-live="polite">
          <div className="rc-note-head"><span>江上注脚</span><b>0{active + 1}</b></div>
          <h2>{poem.notes[active].term}</h2>
          <p>{poem.notes[active].text}</p>
          <button onClick={() => setActive(Math.min(active + 1, poem.lines.length - 1))} disabled={active === poem.lines.length - 1}>
            {active === poem.lines.length - 1 ? "已到烟波尽处" : "顺流再读一句 →"}
          </button>
        </aside>
      </section>

      <nav className="rc-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <aside className="rc-detail" role="dialog" aria-modal="true" aria-label={detail === "translation" ? "译文" : "赏析"}>
        <button className="rc-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section><header><span>{detail === "translation" ? "今译" : "赏析"}</span><button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button></header><p>{detail === "translation" ? poem.translation : poem.appreciation}</p></section>
      </aside>}

      {study && <div className="rc-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="rc-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="rc-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到秋江</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? <div className="rc-recite">
            <small>{phases[reciteIndex]} · {reciteIndex + 1} / {poem.lines.length}</small>
            <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)} aria-label={hidden ? "显出原文" : "隐藏原文"}>
              <Eye size={18} /><span>{poem.lines[reciteIndex]}</span>
            </button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出这一句" : "藏起这一句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "沿江下一句"}</button></div>
          </div>
          : <div className="rc-dictation"><h2>{poem.studyCopy.dictationTitle}</h2>{poem.lines.map((line, index) => { const correct = normalize(answers[index]) === normalize(line); return <label key={line}><span>{markers[index]} · {phases[index]}</span><textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={18} /> : <small>{line}</small>)}</label>; })}{checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}<button className="rc-submit" onClick={checkDictation}>核对默写</button></div>}
        </section>
      </div>}

      <aside className={`rc-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
