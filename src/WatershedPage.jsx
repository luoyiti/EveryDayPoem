import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, SpeakerHigh, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./watershed-parting.css";

function normalizeLine(value = "") {
  return value.replace(/[，。！？、；：,.!?;:\s]/g, "");
}

function StudyOverlay({ poem, mode, onClose }) {
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setReciteIndex(0);
    setHidden(false);
    setAnswers(poem.lines.map(() => ""));
    setChecked(false);
  }, [poem.id, mode]);

  if (!mode) return null;
  const score = answers.filter((answer, index) => normalizeLine(answer) === normalizeLine(poem.lines[index])).length;

  return (
    <div className="watershed-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${mode === "recitation" ? "背诵" : "默写"}`}>
      <button className="watershed-study-backdrop" onClick={onClose} aria-label="关闭学习模式" />
      <section className="watershed-study-sheet">
        <header>
          <button onClick={onClose}><ArrowLeft size={18} /> 回到分水岭</button>
          <span>{mode === "recitation" ? "背诵" : "默写"} · {poem.title}</span>
        </header>

        {mode === "recitation" ? (
          <div className="watershed-recite">
            <p className="watershed-kicker">第 {reciteIndex + 1} / {poem.lines.length} 句</p>
            <h2>让同行的水声慢慢退场</h2>
            <button className={`watershed-recite-line ${hidden ? "is-hidden" : ""}`} onClick={() => setHidden((value) => !value)}>
              {poem.lines[reciteIndex]}
            </button>
            <p>{hidden ? poem.studyCopy?.recitationHint : poem.notes[reciteIndex].text}</p>
            <div className="watershed-study-actions">
              <button className="quiet" onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button>
              <button
                className="solid"
                onClick={() => {
                  if (reciteIndex === poem.lines.length - 1) onClose();
                  else { setReciteIndex((index) => index + 1); setHidden(false); }
                }}
              >
                {reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}
              </button>
            </div>
          </div>
        ) : (
          <div className="watershed-dictation">
            <p className="watershed-kicker">不看原文，沿着四个转折写回来</p>
            <h2>{poem.studyCopy?.dictationTitle}</h2>
            <div className="watershed-inputs">
              {poem.lines.map((line, index) => {
                const correct = normalizeLine(answers[index]) === normalizeLine(line);
                return (
                  <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}>
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
                    />
                    {checked && correct && <Check size={18} />}
                    {checked && !correct && <small>{line}</small>}
                  </label>
                );
              })}
            </div>
            <div className="watershed-study-actions">
              {checked && <p>{score === poem.lines.length ? poem.studyCopy?.dictationSuccess : `写对 ${score} 句，再沿原路走一遍。`}</p>}
              <button className="solid" onClick={() => setChecked(true)}>核对默写</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function HistoryPanel({ open, currentId, onClose, onNavigate }) {
  return (
    <aside className={`watershed-history ${open ? "is-open" : ""}`} aria-hidden={!open} inert={open ? undefined : true}>
      <header>
        <div>
          <span>往日诗笺</span>
          <h2>走过的诗路</h2>
        </div>
        <button onClick={onClose} aria-label="关闭历史"><X size={20} /></button>
      </header>
      <div className="watershed-history-list">
        {poems.map((item, index) => (
          <button key={item.id} className={item.id === currentId ? "is-current" : ""} onClick={() => onNavigate(item.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            <small>{item.dynasty} · {item.author}</small>
            <em>{item.learnedAt}</em>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function WatershedPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [detail, setDetail] = useState("annotation");
  const [studyMode, setStudyMode] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    document.title = `每日古诗文 · ${poem.title}`;
  }, [poem.title]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setStudyMode(null);
        setHistoryOpen(false);
        setDetail("annotation");
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const detailCopy = useMemo(() => {
    if (detail === "translation") return { title: "译文", text: poem.translation };
    if (detail === "appreciation") return { title: "赏析", text: poem.appreciation };
    return null;
  }, [detail, poem]);

  return (
    <div className={`watershed-page ${activeLine >= 2 ? "is-separated" : ""}`}>
      <div className="watershed-topline">
        <div className="watershed-brand"><span>每日古诗文</span><i /></div>
        <button className="watershed-history-trigger" onClick={() => setHistoryOpen(true)}><BookOpenText size={18} /> 诗笺集</button>
      </div>

      <main className="watershed-stage" inert={studyMode || historyOpen ? true : undefined}>
        <section className="watershed-copy" aria-labelledby="watershed-title">
          <header className="watershed-heading">
            <span>山行 · 第八笺</span>
            <h1 id="watershed-title">{poem.title}</h1>
            <p>{poem.dynasty} · {poem.author}</p>
          </header>

          <div className="watershed-route" aria-label="逐句阅读">
            <div className="route-spine" aria-hidden="true"><i className="route-person" /><i className="route-water" /></div>
            {poem.lines.map((line, index) => (
              <button
                key={line}
                className={`watershed-verse watershed-verse--${index} ${activeLine === index ? "is-active" : ""}`}
                onClick={() => { setActiveLine(index); setDetail("annotation"); }}
                aria-current={activeLine === index ? "step" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{line}</strong>
              </button>
            ))}
          </div>

          <div className="watershed-note" aria-live="polite">
            <span>{poem.notes[activeLine].term}</span>
            <p>{poem.notes[activeLine].text}</p>
          </div>
        </section>

        <aside className="watershed-image" aria-label="山岭溪流意境图">
          <img src={poem.image} alt="山岭间一段溪流与远山的意境图" />
          <div>
            <span>同行三日</span>
            <strong>到岭头，路与水各自远去。</strong>
          </div>
        </aside>

        {detailCopy && (
          <aside className="watershed-detail" aria-live="polite">
            <header><span>{detailCopy.title}</span><button onClick={() => setDetail("annotation")} aria-label={`关闭${detailCopy.title}`}><X size={17} /></button></header>
            <p>{detailCopy.text}</p>
          </aside>
        )}

        <nav className="watershed-tools" aria-label="诗词学习">
          <button className={detail === "annotation" ? "is-active" : ""} onClick={() => setDetail("annotation")}>注释</button>
          <button className={detail === "translation" ? "is-active" : ""} onClick={() => setDetail("translation")}>译文</button>
          <button className={detail === "appreciation" ? "is-active" : ""} onClick={() => setDetail("appreciation")}>赏析</button>
          <button onClick={() => setStudyMode("recitation")}><SpeakerHigh size={16} /> 背诵</button>
          <button onClick={() => setStudyMode("dictation")}><Feather size={16} /> 默写</button>
        </nav>
      </main>

      <HistoryPanel
        open={historyOpen}
        currentId={poem.id}
        onClose={() => setHistoryOpen(false)}
        onNavigate={(id) => { setHistoryOpen(false); onNavigate(id); }}
      />
      <button className={`watershed-scrim ${historyOpen ? "is-visible" : ""}`} onClick={() => setHistoryOpen(false)} aria-label="关闭历史" />
      <StudyOverlay poem={poem} mode={studyMode} onClose={() => setStudyMode(null)} />
    </div>
  );
}
