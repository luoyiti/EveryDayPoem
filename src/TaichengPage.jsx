import { useEffect, useState } from "react";
import { ArrowLeft, BookOpenText, Check, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./taicheng-rain.css";

function normalize(line) {
  return line.replace(/[，。！？、\s]/g, "");
}

export function TaichengPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState("annotation");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [studyMode, setStudyMode] = useState(null);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    document.title = `每日古诗文 · ${poem.title}`;
    setActiveLine(0);
    setDetail("annotation");
    setStudyMode(null);
    setAnswers(poem.lines.map(() => ""));
  }, [poem]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setHistoryOpen(false);
      setStudyMode(null);
      setDetail("annotation");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const detailTitle = detail === "translation" ? "译文" : "赏析";
  const detailContent = detail === "translation" ? poem.translation : poem.appreciation;
  const score = answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length;

  function openStudy(mode) {
    setStudyMode(mode);
    setChecked(false);
    setReciteIndex(0);
    setHidden(false);
    setAnswers(poem.lines.map(() => ""));
  }

  function nextRecitation() {
    if (reciteIndex === poem.lines.length - 1) {
      setStudyMode(null);
      return;
    }
    setReciteIndex((value) => value + 1);
    setHidden(false);
  }

  return (
    <div className="app-shell">
      <main className="poem-page taicheng-rain" inert={historyOpen || studyMode ? true : undefined}>
        <div className="taicheng-image" aria-hidden="true"><img src={poem.image} alt="" /></div>
        <div className="brand brand--dark"><span>每日古诗文</span><i aria-hidden="true" /></div>
        <button className="taicheng-history" onClick={() => setHistoryOpen(true)}>
          <BookOpenText size={18} weight="light" /> 往日诗笺
        </button>

        <header className="taicheng-heading">
          <span>金陵 · 台城</span>
          <h1>{poem.title}</h1>
          <p>{poem.dynasty} · {poem.author}</p>
        </header>

        <section className="taicheng-strata" aria-label="台城逐句阅读">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={activeLine === index ? "is-active" : ""}
              onClick={() => { setActiveLine(index); setDetail("annotation"); }}
              aria-current={activeLine === index ? "step" : undefined}
            >
              <span className="taicheng-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="taicheng-line">{line}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </section>

        <div className="taicheng-note" aria-live="polite">
          <strong>{poem.notes[activeLine].term}</strong>
          <p>{poem.notes[activeLine].text}</p>
        </div>

        {detail !== "annotation" && (
          <aside className="taicheng-detail" aria-live="polite">
            <header>
              <span>{detailTitle}</span>
              <button onClick={() => setDetail("annotation")} aria-label={`关闭${detailTitle}`}><X size={17} /></button>
            </header>
            <p>{detailContent}</p>
          </aside>
        )}

        <nav className="taicheng-tools" aria-label="诗词学习">
          <button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button>
          <button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button>
          <button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button>
          <button onClick={() => openStudy("recitation")}>背诵</button>
          <button onClick={() => openStudy("dictation")}>默写</button>
        </nav>
      </main>

      <aside className={`history-drawer ${historyOpen ? "is-open" : ""}`} aria-hidden={!historyOpen} inert={historyOpen ? undefined : true}>
        <header className="history-header">
          <div><span className="eyebrow">已读 · {poems.length}首</span><h2>往日诗笺</h2></div>
          <button className="icon-button" onClick={() => setHistoryOpen(false)} aria-label="关闭诗笺集"><X size={20} /></button>
        </header>
        <div className="history-list">
          {poems.map((item, index) => (
            <button className={`history-row ${item.id === poem.id ? "is-current" : ""}`} key={item.id} onClick={() => { setHistoryOpen(false); onNavigate(item.id); }}>
              <span className="history-number">{String(index + 1).padStart(2, "0")}</span>
              <img src={item.image} alt={`${item.title}页面意境预览`} />
              <span className="history-copy"><strong>{item.title}</strong><small>{item.dynasty} · {item.author}</small><em>{item.learnedAt}</em></span>
              <span className="history-status">阅</span>
            </button>
          ))}
        </div>
      </aside>
      <div className={`drawer-scrim ${historyOpen ? "is-visible" : ""}`} onClick={() => setHistoryOpen(false)} />

      {studyMode && (
        <div className="study-overlay" role="dialog" aria-modal="true" aria-labelledby="taicheng-study-title">
          <div className="study-backdrop" onClick={() => setStudyMode(null)} />
          <section className={`study-sheet study-sheet--${studyMode}`}>
            <header>
              <button className="study-back" onClick={() => setStudyMode(null)}><ArrowLeft size={18} /> 返回诗境</button>
              <span>{poem.title} · {studyMode === "dictation" ? "默写" : "背诵"}</span>
            </header>
            {studyMode === "dictation" ? (
              <div className="dictation-content">
                <span className="eyebrow">不看原文，写下你记得的句子</span>
                <h2 id="taicheng-study-title">{poem.studyCopy.dictationTitle}</h2>
                <div className="dictation-lines">
                  {poem.lines.map((line, index) => {
                    const correct = normalize(answers[index]) === normalize(line);
                    return (
                      <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}>
                        <span>{index + 1}</span>
                        <input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="在这里默写……" autoFocus={index === 0} />
                        {checked && !correct && <small>{line}</small>}
                        {checked && correct && <Check size={18} />}
                      </label>
                    );
                  })}
                </div>
                <div className="study-actions">
                  {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，再沿着原句读一遍。`}</p>}
                  <button className="primary-button" onClick={() => setChecked(true)}>核对默写</button>
                </div>
              </div>
            ) : (
              <div className="recitation-content">
                <span className="eyebrow">第 {reciteIndex + 1} / {poem.lines.length} 句</span>
                <h2 id="taicheng-study-title">先读，再让它消失</h2>
                <button className={`recite-line ${hidden ? "is-hidden" : ""}`} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div className="study-actions">
                  <button className="quiet-button" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button>
                  <button className="primary-button" onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
