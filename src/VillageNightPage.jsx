import { useEffect, useState } from "react";
import { poems } from "./data/poems.js";
import "./village-night.css";

const clean = (value) => value.replace(/[，。！？、\s]/g, "");

export function VillageNightPage({ poem, onNavigate }) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [panel, setPanel] = useState("annotation");
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setStudy(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const score = answers.filter((answer, index) => clean(answer) === clean(poem.lines[index])).length;

  return (
    <main className={`village-night-page ${doorOpen ? "is-open" : ""}`}>
      <img className="village-night-scene" src={poem.image} alt="" aria-hidden="true" />
      <div className="village-night-moonwash" aria-hidden="true" />
      <header className="village-night-brand">
        <span>每日古诗文</span>
        <button onClick={() => setStudy("history")}>往日诗笺</button>
      </header>

      <section className="village-night-threshold" aria-labelledby="village-night-title">
        <div className="village-night-heading">
          <span>秋夜 · 第九笺</span>
          <h1 id="village-night-title">{poem.title}</h1>
          <p>{poem.dynasty} · {poem.author}</p>
        </div>

        <div className="village-night-verses">
          {poem.lines.map((line, index) => (
            <button
              key={line}
              className={activeLine === index ? "is-active" : ""}
              onClick={() => { setActiveLine(index); setPanel("annotation"); if (index > 1) setDoorOpen(true); }}
              aria-current={activeLine === index ? "true" : undefined}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{line}</span>
            </button>
          ))}
        </div>

        <div className="village-night-note" aria-live="polite">
          <strong>{poem.notes[activeLine].term}</strong>
          <p>{poem.notes[activeLine].text}</p>
        </div>

        <button className="village-night-door" onClick={() => setDoorOpen((value) => !value)}>
          <span>{doorOpen ? "收回村门" : "推门见月"}</span>
          <i aria-hidden="true" />
        </button>
      </section>

      {panel !== "annotation" && (
        <aside className="village-night-detail" aria-live="polite">
          <span>{panel === "translation" ? "译文" : "赏析"}</span>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="village-night-tools" aria-label="诗词学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}>背诵</button>
        <button onClick={() => { setStudy("dictation"); setChecked(false); }}>默写</button>
      </nav>

      {study && (
        <div className="village-night-overlay" role="dialog" aria-modal="true">
          <button className="village-night-backdrop" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="village-night-sheet">
            <header>
              <span>{study === "history" ? "往日诗笺" : `${poem.title} · ${study === "recitation" ? "背诵" : "默写"}`}</span>
              <button onClick={() => setStudy(null)}>关闭</button>
            </header>

            {study === "history" && (
              <div className="village-night-history">
                {poems.map((item) => (
                  <button key={item.id} className={item.id === poem.id ? "is-current" : ""} onClick={() => { setStudy(null); onNavigate(item.id); }}>
                    <span>{item.title}</span><small>{item.dynasty} · {item.author} · {item.learnedAt}</small>
                  </button>
                ))}
              </div>
            )}

            {study === "recitation" && (
              <div className="village-night-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 句</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <footer>
                  <button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原句" : "遮住原句"}</button>
                  <button onClick={() => { if (reciteIndex === poem.lines.length - 1) setStudy(null); else { setReciteIndex((i) => i + 1); setHidden(false); } }}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "下一句"}</button>
                </footer>
              </div>
            )}

            {study === "dictation" && (
              <div className="village-night-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                {poem.lines.map((line, index) => {
                  const correct = clean(answers[index]) === clean(line);
                  return <label key={line} className={checked ? (correct ? "is-correct" : "is-wrong") : ""}><span>{index + 1}</span><input value={answers[index]} onChange={(event) => { const next=[...answers]; next[index]=event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写这一句" />{checked && !correct && <small>{line}</small>}</label>;
                })}
                {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续沿着“霜草—村路—前门—月田”的顺序回想。`}</p>}
                <button className="village-night-check" onClick={() => setChecked(true)}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
