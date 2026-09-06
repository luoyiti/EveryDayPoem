import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./xiamouse-night.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？、；：“”‘’《》〈〉（）()\s]/g, "");
const STORY_END = 5;

export function XiamouseNightPage({ poem, onNavigate }) {
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
    <main className="xiamouse-page">
      <img className="xiamouse-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="xiamouse-shade" aria-hidden="true" />

      <header className="xiamouse-header">
        <div className="xiamouse-brand"><strong>每日古诗文</strong><span>夜坐 · 声止 · 鼠逸</span></div>
        <div><span>2026 / 09 / 07</span><button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button></div>
      </header>

      <section className="xiamouse-stage" aria-labelledby="xiamouse-title">
        <div className="xiamouse-title-block">
          <small>{poem.dynasty} · {poem.form}</small>
          <h1 id="xiamouse-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <span>从袋中一声咬啮，读到一次关于“心神不一”的自省。</span>
        </div>

        <div className="xiamouse-reading">
          <div className="xiamouse-phase-head">
            <span>壹 · 夜间小事</span>
            <small>声音 → 寂静 → 脱逃 → 反问</small>
          </div>
          <ol className="xiamouse-story" aria-label="黠鼠脱逃的叙事段落">
            {poem.lines.slice(0, STORY_END).map((line, index) => (
              <li key={index} className={activeLine === index ? "is-active" : ""}>
                <button onClick={() => selectLine(index)} aria-current={activeLine === index ? "step" : undefined}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{line}</span>
                  <i aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>

          <div className="xiamouse-turn" aria-hidden="true"><span>鼠已逸</span><i /></div>

          <div className="xiamouse-phase-head is-reflection">
            <span>贰 · 假寝自问</span>
            <small>外物停止，心里的声音开始</small>
          </div>
          <ol className="xiamouse-reflection" start={STORY_END + 1} aria-label="假寝后的自省段落">
            {poem.lines.slice(STORY_END).map((line, offset) => {
              const index = STORY_END + offset;
              return (
                <li key={index} className={activeLine === index ? "is-active" : ""}>
                  <button onClick={() => selectLine(index)} aria-current={activeLine === index ? "step" : undefined}>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{line}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="xiamouse-note" aria-live="polite">
          <small>{activeLine < 3 ? "听见 · 看见 · 失手" : activeLine < 5 ? "识破鼠计" : "转入自省"}</small>
          <h2>{poem.notes[activeLine].term}</h2>
          <p>{poem.notes[activeLine].text}</p>
          <span>{String(activeLine + 1).padStart(2, "0")} / {poem.lines.length}</span>
        </aside>
      </section>

      {panel !== "annotation" && (
        <aside className="xiamouse-detail" aria-live="polite">
          <header><span>{panel === "translation" ? "今译" : "赏析"}</span><button onClick={() => setPanel("annotation")} aria-label="关闭"><X size={17} /></button></header>
          <p>{panel === "translation" ? poem.translation : poem.appreciation}</p>
        </aside>
      )}

      <nav className="xiamouse-tools" aria-label="赋作学习">
        <button className={panel === "annotation" ? "is-active" : ""} onClick={() => setPanel("annotation")}>注释</button>
        <button className={panel === "translation" ? "is-active" : ""} onClick={() => setPanel("translation")}>译文</button>
        <button className={panel === "appreciation" ? "is-active" : ""} onClick={() => setPanel("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
        <button onClick={() => setHistory(true)}><List size={16} /> 历史</button>
      </nav>

      {study && (
        <div className="xiamouse-study" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
          <button className="xiamouse-study-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
          <section className="xiamouse-study-sheet">
            <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到夜坐</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
            {study === "recitation" ? (
              <div className="xiamouse-recite">
                <small>第 {reciteIndex + 1} / {poem.lines.length} 段</small>
                <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
                <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
                <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "遮住原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "继续下一段"}</button></div>
              </div>
            ) : (
              <div className="xiamouse-dictation">
                <h2>{poem.studyCopy.dictationTitle}</h2>
                <div className="xiamouse-answer-list">
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
                <button className="xiamouse-submit" onClick={checkDictation}>核对默写</button>
              </div>
            )}
          </section>
        </div>
      )}

      <aside className={`xiamouse-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><span><strong>{item.title}</strong><small>{item.genre || "诗"} · {item.dynasty} · {item.author}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
