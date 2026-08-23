import { useEffect, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, X } from "@phosphor-icons/react";
import { poems, poemsById } from "./data/poems.js";

function goToPoem(id) {
  window.location.hash = id;
}

function StudyDialog({ poem, mode, onClose }) {
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setAnswers(poem.lines.map(() => ""));
    setChecked(false);
    setReciteIndex(0);
    setHidden(false);
  }, [poem.id, mode]);

  if (!mode) return null;
  const normalized = (value) => value.replace(/[，。！？、\s]/g, "");
  const score = answers.filter((answer, index) => normalized(answer) === normalized(poem.lines[index])).length;

  return (
    <div className="path-study" role="dialog" aria-modal="true" aria-labelledby="path-study-title">
      <button className="path-study__backdrop" aria-label="关闭学习面板" onClick={onClose} />
      <section className="path-study__sheet">
        <header>
          <button onClick={onClose}><ArrowLeft size={18} /> 返回春山</button>
          <span>{poem.title} · {mode === "dictation" ? "默写" : "背诵"}</span>
        </header>
        {mode === "dictation" ? (
          <div className="path-dictation">
            <p className="path-kicker">不看原文，沿着四步写回来</p>
            <h2 id="path-study-title">{poem.studyCopy.dictationTitle}</h2>
            <div className="path-dictation__lines">
              {poem.lines.map((line, index) => {
                const correct = normalized(answers[index]) === normalized(line);
                return (
                  <label className={checked ? (correct ? "is-correct" : "is-wrong") : ""} key={line}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <input
                      value={answers[index]}
                      onChange={(event) => {
                        const next = [...answers];
                        next[index] = event.target.value;
                        setAnswers(next);
                        setChecked(false);
                      }}
                      placeholder="默写这一句"
                      autoFocus={index === 0}
                    />
                    {checked && correct && <Check size={17} />}
                    {checked && !correct && <small>{line}</small>}
                  </label>
                );
              })}
            </div>
            <div className="path-study__actions">
              {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句；对照原句再走一遍。`}</p>}
              <button onClick={() => setChecked(true)}>核对默写</button>
            </div>
          </div>
        ) : (
          <div className="path-recitation">
            <p className="path-kicker">第 {reciteIndex + 1} / {poem.lines.length} 步</p>
            <h2 id="path-study-title">先看景，再让句子消失</h2>
            <button className={hidden ? "path-recite-line is-hidden" : "path-recite-line"} onClick={() => setHidden((value) => !value)}>
              {poem.lines[reciteIndex]}
            </button>
            <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
            <div className="path-study__actions">
              <button className="is-quiet" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button>
              <button onClick={() => {
                if (reciteIndex === poem.lines.length - 1) onClose();
                else {
                  setReciteIndex((value) => value + 1);
                  setHidden(false);
                }
              }}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一步"}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function PathHistory({ open, onClose, currentId }) {
  return (
    <aside className={open ? "path-history is-open" : "path-history"} aria-hidden={!open} inert={open ? undefined : true}>
      <header>
        <div><span>已读 · {poems.length} 首</span><h2>往日诗笺</h2></div>
        <button onClick={onClose} aria-label="关闭往日诗笺"><X size={20} /></button>
      </header>
      <div className="path-history__list">
        {poems.map((item, index) => (
          <button key={item.id} className={item.id === currentId ? "is-current" : ""} onClick={() => goToPoem(item.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <img src={item.image} alt="" />
            <strong>{item.title}<small>{item.dynasty} · {item.author}</small></strong>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function SpringPathPage() {
  const poem = poemsById["spring-path"];
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState("annotation");
  const [studyMode, setStudyMode] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    document.title = `每日古诗文 · ${poem.title}`;
  }, [poem.title]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setStudyMode(null);
        setHistoryOpen(false);
        setDetail("annotation");
      }
      if (event.key === "ArrowDown") setActiveLine((value) => Math.min(poem.lines.length - 1, value + 1));
      if (event.key === "ArrowUp") setActiveLine((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [poem.lines.length]);

  const detailText = detail === "translation" ? poem.translation : poem.appreciation;

  return (
    <main className="spring-path-page">
      <div className="path-scene" aria-hidden="true"><img src={poem.image} alt="" /></div>
      <div className="path-paper" aria-hidden="true" />

      <header className="path-brand">
        <span>每日古诗文</span>
        <button onClick={() => setHistoryOpen(true)}><BookOpenText size={18} /> 往日诗笺</button>
      </header>

      <section className="path-title" aria-labelledby="spring-path-title">
        <p>春日 · 行路</p>
        <h1 id="spring-path-title">{poem.title}</h1>
        <span>{poem.dynasty} · {poem.author}</span>
      </section>

      <section className="path-route" aria-label="沿春山逐句阅读">
        <div className="path-route__line" aria-hidden="true" />
        {poem.lines.map((line, index) => (
          <button
            key={line}
            className={activeLine === index ? `path-step path-step--${index + 1} is-active` : `path-step path-step--${index + 1}`}
            onClick={() => { setActiveLine(index); setDetail("annotation"); }}
            aria-current={activeLine === index ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{line}</strong>
          </button>
        ))}
      </section>

      <aside className="path-note" aria-live="polite">
        {detail === "annotation" ? (
          <><span>第 {activeLine + 1} 步 · 注释</span><h2>{poem.notes[activeLine].term}</h2><p>{poem.notes[activeLine].text}</p></>
        ) : (
          <><span>{detail === "translation" ? "译文" : "赏析"}</span><p>{detailText}</p></>
        )}
      </aside>

      <nav className="path-tools" aria-label="诗词学习">
        <button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button>
        <button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button>
        <button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => setStudyMode("recitation")}><Feather size={16} /> 背诵</button>
        <button onClick={() => setStudyMode("dictation")}>默写</button>
      </nav>

      <PathHistory open={historyOpen} onClose={() => setHistoryOpen(false)} currentId={poem.id} />
      <button className={historyOpen ? "path-history-scrim is-visible" : "path-history-scrim"} aria-label="关闭往日诗笺" onClick={() => setHistoryOpen(false)} />
      <StudyDialog poem={poem} mode={studyMode} onClose={() => setStudyMode(null)} />
    </main>
  );
}
