import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./songfeng-rest.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、；：“”‘’《》〈〉（）()\s]/g, "");

export function SongfengRestPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [history, setHistory] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        setStudy(null);
        setHistory(false);
        setPanel("annotation");
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

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
    } catch { /* Learning remains usable when storage is blocked. */ }
  }

  function selectLine(index) {
    setActiveLine(index);
    setPanel("annotation");
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      markComplete("recitation");
      setStudy(null);
      return;
    }
    setReciteIndex((index) => index + 1);
    setHidden(false);
  }

  function checkDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  return (
    <main className="songfeng-page">
      <img className="songfeng-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="songfeng-veil" aria-hidden="true" />

      <header className="songfeng-header">
        <div className="songfeng-brand"><strong>每日古诗文</strong><span>未到亭前 · 先在此间歇下</span></div>
        <div><span>2026 / 09 / 07</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="songfeng-stage" aria-labelledby="songfeng-title">
        <div className="songfeng-title-block">
          <small>{poem.dynasty} · {poem.form}</small>
          <h1 id="songfeng-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <span>目标仍在树梢，休息却不必等到抵达。</span>
        </div>

        <div className="songfeng-reading">
          <div className="songfeng-distance" aria-hidden="true"><span>亭宇</span><i /></div>
          <ol aria-label="记游松风亭阅读路径">
            {poem.lines.map((line, index) => (
              <li key={index} className={`songfeng-step step-${index + 1} ${activeLine === index ? "is-active" : ""} ${index === 2 ? "is-turn" : ""}`}>
                <button onClick={() => selectLine(index)} aria-current={activeLine === index ? "step" : undefined}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{line}</span>
                </button>
                {index === 2 && <em>此间</em>}
              </li>
            ))}
          </ol>
          <div className="songfeng-restline"><i /><span>不再向亭宇证明抵达</span></div>
        </div>

        <aside className="songfeng-note" aria-live="polite">
          <small>{activeLine < 2 ? "上行 · 目标" : activeLine < 4 ? "停步 · 松脱" : "极端假设 · 熟歇"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>{String(activeLine + 1).padStart(2, "0")} / {poem.lines.length}</span>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="songfeng-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="songfeng-tools" aria-label="文章学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        <button onClick={() => setHistory(true)}><List size={16} /> 历史</button>
      </nav>

      {study && (
        <div className="songfeng-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="songfeng-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="songfeng-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到此间</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="songfeng-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 段</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "遮住原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "继续下一段"}</button></div>
              </div>
            ) : (
              <div className="songfeng-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                <div className="songfeng-answer-list">
                  {poem.lines.map((line, index) => {
                    const correct = normalize(answers[index]) === normalize(line);
                    return (
                      <label key={index}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <textarea rows={2} value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一段" />
                        {checked && (correct ? <Check size={18} /> : <small>{line}</small>)}
                      </label>
                    );
                  })}
                </div>
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 段，继续核对。`}</p>}
                <button className="songfeng-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`songfeng-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><span><strong>{item.title}</strong><small>{item.genre || "诗"} · {item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
