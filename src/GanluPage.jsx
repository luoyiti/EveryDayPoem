import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./ganlu-window.css";

const STORAGE_KEY = "daily-poetry-progress-v1";

function normalize(value) {
  return value.replace(/[，。！？、\s]/g, "");
}

export function GanluPage({ poem, onNavigate }) {
  const [windowOpen, setWindowOpen] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  const score = useMemo(
    () => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length,
    [answers, poem.lines],
  );

  useEffect(() => {
    document.title = `每日古诗文 · ${poem.title}`;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setPanel("annotation");
        setStudy(null);
        setHistoryOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [poem.title]);

  function chooseLine(index) {
    setActiveLine(index);
    setPanel("annotation");
    if (index >= 2) setWindowOpen(true);
  }

  function openRiver() {
    setWindowOpen(true);
    setActiveLine(3);
    setPanel("annotation");
  }

  function complete(kind) {
    try {
      const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      current[poem.id] = { ...(current[poem.id] || {}), completed: true, [kind]: true, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Progress persistence is optional; study remains usable when storage is unavailable.
    }
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      complete("recitation");
      setStudy(null);
      return;
    }
    setReciteIndex((index) => index + 1);
    setHidden(false);
  }

  return (
    <main className={`ganlu-page ${windowOpen ? "is-open" : ""}`}>
      <img className="ganlu-river-image" src={poem.image} alt="" aria-hidden="true" />
      <div className="ganlu-river-shade" aria-hidden="true" />

      <header className="ganlu-topbar">
        <div className="ganlu-brand">每日古诗文</div>
        <button className="ganlu-history-trigger" onClick={() => setHistoryOpen(true)}>往日诗笺</button>
      </header>

      <section className="ganlu-room" aria-labelledby="ganlu-title">
        <header className="ganlu-heading">
          <span>山寺 · 临江</span>
          <h1 id="ganlu-title">{poem.title}</h1>
          <p>{poem.dynasty} · {poem.author}</p>
        </header>

        <div className="ganlu-reading" aria-label="逐句阅读">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`ganlu-line ${activeLine === index ? "is-active" : ""} ${index === 3 && !windowOpen ? "is-veiled" : ""}`}
              onClick={() => chooseLine(index)}
              aria-current={activeLine === index ? "step" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{index === 3 && !windowOpen ? "开窗之后" : line}</strong>
            </button>
          ))}
        </div>

        <div className="ganlu-note" aria-live="polite">
          <span>{poem.notes[activeLine].term}</span>
          <p>{poem.notes[activeLine].text}</p>
        </div>

        {!windowOpen && (
          <button className="ganlu-open-window" onClick={openRiver}>
            <span>要看银山拍天浪</span>
            <strong>推开窗</strong>
          </button>
        )}
      </section>

      <aside className="ganlu-window-frame" aria-hidden="true">
        <i /><i /><i />
      </aside>

      {windowOpen && (
        <div className="ganlu-river-caption" aria-live="polite">
          <span>04</span>
          <p>{poem.lines[3]}</p>
        </div>
      )}

      {panel !== "annotation" && (
        <aside className="ganlu-detail" aria-live="polite">
          <header>
            <span>{panel === "translation" ? "译文" : "赏析"}</span>
            <button onClick={() => setPanel("annotation")} aria-label="关闭内容">×</button>
          </header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="ganlu-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {historyOpen && (
        <div className="ganlu-modal" role="dialog" aria-modal="true" aria-label="往日诗笺">
          <button className="ganlu-modal-backdrop" onClick={() => setHistoryOpen(false)} aria-label="关闭历史" />
          <section className="ganlu-history">
            <header><span>往日诗笺</span><button onClick={() => setHistoryOpen(false)}>关闭</button></header>
            <div>
              {poems.map((item, index) => (
                <button key={item.id} className={item.id === poem.id ? "is-current" : ""} onClick={() => { setHistoryOpen(false); onNavigate(item.id); }}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{item.title}</span>
                  <em>{item.dynasty} · {item.author}</em>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {study && (
        <div className="ganlu-modal" role="dialog" aria-modal="true" aria-label={study === "dictation" ? "默写" : "背诵"}>
          <button className="ganlu-modal-backdrop" onClick={() => setStudy(null)} aria-label="关闭学习" />
          <section className="ganlu-study">
            <header><button onClick={() => setStudy(null)}>返回诗境</button><span>{poem.title} · {study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "dictation" ? (
              <div className="ganlu-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return (
                    <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}>
                      <span>{index + 1}</span>
                      <input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="在这里默写……" />
                      {checked && !correct && <small>{line}</small>}
                    </label>
                  );
                })}
                <footer>
                  {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，再核对一次。`}</p>}
                  <button onClick={() => { setChecked(true); if (score === poem.lines.length) complete("dictation"); }}>核对默写</button>
                </footer>
              </div>
            ) : (
              <div className="ganlu-recitation">
                <span>第 {reciteIndex + 1} / {poem.lines.length} 句</span>
                <h2>先听见，再开窗</h2>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <footer><button onClick={() => setHidden((value) => !value)}>{hidden ? "显示原句" : "遮住原句"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button></footer>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
