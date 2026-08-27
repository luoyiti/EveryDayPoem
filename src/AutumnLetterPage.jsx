import { useEffect, useMemo, useState } from "react";
import { poems } from "./data/poems.js";
import "./autumn-letter.css";

const clean = (value) => value.replace(/[，。！？、\s]/g, "");

export function AutumnLetterPage({ poem, onNavigate }) {
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const side = activeLine < 2 ? "near" : "far";
  const score = useMemo(() => answers.filter((answer, index) => clean(answer) === clean(poem.lines[index])).length, [answers, poem.lines]);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") setStudy(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openRecitation() {
    setStudy("recitation");
    setReciteIndex(0);
    setHidden(false);
  }

  return (
    <main className={`autumn-letter-page is-${side}`}>
      <img className="autumn-letter-texture" src={poem.image} alt="" aria-hidden="true" />
      <div className="autumn-letter-grain" aria-hidden="true" />

      <header className="autumn-letter-brand">
        <span>每日古诗文</span>
        <button onClick={() => setStudy("history")}>往日诗笺</button>
      </header>

      <section className="autumn-letter-heading" aria-labelledby="autumn-letter-title">
        <span>秋夜 · 第十笺</span>
        <h1 id="autumn-letter-title">{poem.title}</h1>
        <p>{poem.dynasty} · {poem.author}</p>
      </section>

      <section className="autumn-letter-stage" aria-label="从此夜到彼山的逐句阅读">
        <div className="autumn-letter-place autumn-letter-place--near">
          <span>此夜</span>
          <small>散步 · 怀人</small>
        </div>
        <div className="autumn-letter-place autumn-letter-place--far">
          <span>彼山</span>
          <small>松子 · 幽人</small>
        </div>

        <div className="autumn-letter-verses">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={`autumn-letter-verse line-${index + 1} ${activeLine === index ? "is-active" : ""}`}
              onClick={() => { setActiveLine(index); setPanel("annotation"); }}
              aria-current={activeLine === index ? "true" : undefined}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{line}</span>
            </button>
          ))}
        </div>

        <div className="autumn-letter-distance" aria-hidden="true">
          <i /><i /><i /><i />
        </div>

        <aside className="autumn-letter-note" aria-live="polite">
          <span>{side === "near" ? "此夜所见" : "彼山所想"}</span>
          <strong>{poem.notes[activeLine].term}</strong>
          <p>{poem.notes[activeLine].text}</p>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="autumn-letter-detail" aria-live="polite">
          <span>{panel === "translation" ? "译文" : "赏析"}</span>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="autumn-letter-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={openRecitation}>背诵</button>
        <button onClick={() => { setStudy("dictation"); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="autumn-letter-overlay" role="dialog" aria-modal="true" aria-label="学习与历史">
          <button className="autumn-letter-backdrop" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="autumn-letter-sheet">
            <header>
              <span>{study === "history" ? "往日诗笺" : `${poem.title} · ${study === "recitation" ? "背诵" : "默写"}`}</span>
              <button onClick={() => setStudy(null)}>关闭</button>
            </header>

            {study === "history" && (
              <div className="autumn-letter-history">
                {poems.map((item) => (
                  <button key={item.id} className={item.id === poem.id ? "is-current" : ""} onClick={() => { setStudy(null); onNavigate(item.id); }}>
                    <span>{item.title}</span><small>{item.dynasty} · {item.author} · {item.learnedAt}</small>
                  </button>
                ))}
              </div>
            )}

            {study === "recitation" && (
              <div className="autumn-letter-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <footer>
                  <button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button>
                  <button onClick={() => {
                    if (reciteIndex === poem.lines.length - 1) setStudy(null);
                    else { setReciteIndex((index) => index + 1); setHidden(false); }
                  }}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button>
                </footer>
              </div>
            )}

            {study === "dictation" && (
              <div className="autumn-letter-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = clean(answers[index]) === clean(line);
                  return (
                    <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}>
                      <span>{index + 1}</span>
                      <input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />
                      {checked && !correct && <small>{line}</small>}
                    </label>
                  );
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，按“此夜—散步—空山—幽人”的顺序再想一遍。`}</p>}
                <button className="autumn-letter-check" onClick={() => setChecked(true)}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
