import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bird, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./luanjia-rapids.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、\s]/g, "");

export function LuanjiaRapidsPage({ poem, onNavigate }) {
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
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setStudy(null);
        setHistory(false);
        setPanel("annotation");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    } catch {
      // Study remains usable when storage is blocked.
    }
  }

  function submitDictation() {
    setChecked(true);
    if (score === poem.lines.length) markComplete("dictation");
  }

  function advanceRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      markComplete("recitation");
      setStudy(null);
      return;
    }
    setReciteIndex((value) => value + 1);
    setHidden(false);
  }

  const detailText = panel === "translation" ? poem.translation : poem.appreciation;

  return (
    <main className="luanjia-page">
      <img className="luanjia-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="luanjia-rain" aria-hidden="true" />

      <header className="luanjia-header">
        <a className="luanjia-brand" href="#" onClick={(event) => event.preventDefault()}>
          <strong>每日古诗文</strong><span>一濑 · 一瞬</span>
        </a>
        <div className="luanjia-meta"><span>2026 / 09 / 03</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="luanjia-stage" aria-labelledby="luanjia-title">
        <div className="luanjia-intro">
          <p>秋雨 · 石濑 · 白鹭</p>
          <h1 id="luanjia-title">{poem.title}</h1>
          <span>{poem.dynasty} · {poem.author}</span>
          <small>沿水势读四句：雨声先落，水花忽起，白鹭一惊，再归于静。</small>
        </div>

        <div className="luanjia-stream" aria-label="沿石濑逐句阅读">
          <div className={`luanjia-egret egret-step-${activeLine}`} aria-hidden="true"><Bird size={26} weight="light" /></div>
          <ol>
            {poem.lines.map((line, index) => (
              <li key={line} className={activeLine === index ? "is-active" : ""}>
                <button onClick={() => { setActiveLine(index); setPanel("annotation"); }} aria-current={activeLine === index ? "step" : undefined}>
                  <small>0{index + 1}</small><strong>{line}</strong><i aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <aside className="luanjia-note" aria-live="polite">
          <div className="luanjia-note-index"><span>0{activeLine + 1}</span><i /></div>
          <div><small>{activeLine < 2 ? "听水" : activeLine === 2 ? "见波" : "复静"}</small><h2>{poem.notes[activeLine].term}</h2><p>{poem.notes[activeLine].text}</p></div>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="luanjia-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{detailText}</p>
        </aside>
      )}

      <nav className="luanjia-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="luanjia-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="luanjia-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="luanjia-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到石濑</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="luanjia-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button><button onClick={advanceRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "顺流下一句"}</button></div>
              </div>
            ) : (
              <div className="luanjia-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
                <button className="luanjia-dictation-submit" onClick={submitDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`luanjia-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 首</small><h2>往日诗笺</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
