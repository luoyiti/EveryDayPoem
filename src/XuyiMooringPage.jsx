import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, Feather, List, MoonStars, X } from "@phosphor-icons/react";
import { poems } from "./data/poems.js";
import "./xuyi-mooring.css";

const STORAGE_KEY = "daily-poetry-progress-v1";
const normalize = (value = "") => value.replace(/[，。！？；：、“”‘’（）()《》\s]/g, "");
const stations = [
  { mark: "泊", label: "落帆 · 孤驿", lines: [0, 1], cue: "舟行停住" },
  { mark: "暮", label: "风波 · 沈夕", lines: [2, 3], cue: "天光下沉" },
  { mark: "归", label: "人归 · 雁下", lines: [4, 5], cue: "万物有栖" },
  { mark: "钟", label: "秦关 · 未眠", lines: [6, 7], cue: "声音入夜" },
];

export function XuyiMooringPage({ poem, onNavigate }) {
  const [station, setStation] = useState(0);
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState(false);
  const [study, setStudy] = useState(null);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [answers, setAnswers] = useState(() => poem.lines.map(() => ""));
  const [checked, setChecked] = useState(false);

  useEffect(() => { document.title = `每日古诗文 · ${poem.title}`; }, [poem.title]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setDetail(null); setHistory(false); setStudy(null); return; }
      if (detail || history || study) return;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) setStation((value) => Math.min(value + 1, stations.length - 1));
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) setStation((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, history, study]);

  const activeLines = stations[station].lines;
  const score = useMemo(() => answers.filter((answer, index) => normalize(answer) === normalize(poem.lines[index])).length, [answers, poem.lines]);

  function markComplete(kind) {
    try {
      const previous = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...previous,
        [poem.id]: { ...previous[poem.id], completed: true, [kind]: true, updatedAt: new Date().toISOString() },
      }));
    } catch { /* Storage is optional. */ }
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
    <main className="xy-page">
      <img className="xy-bg" src={poem.image} alt="" aria-hidden="true" />
      <div className="xy-tide" aria-hidden="true" />
      <div className="xy-night" aria-hidden="true" />

      <header className="xy-header">
        <a className="xy-brand" href="#xuci-xuyi-twilight" aria-label="每日古诗文首页">
          <strong>每日古诗文</strong>
          <span>泊舟之后，暮色把世界一层层收静</span>
        </a>
        <div className="xy-meta">
          <span>{poem.learnedAt} · {poem.dynasty} · {poem.genre}</span>
          <button onClick={() => setHistory(true)}><BookOpenText size={17} /> 往日</button>
        </div>
      </header>

      <section className="xy-stage" aria-labelledby="xy-title">
        <div className="xy-title-block">
          <small>{poem.form}</small>
          <h1 id="xy-title">{poem.title}</h1>
          <p>{poem.author}</p>
          <div className="xy-title-rule"><i />落帆 · 归雁 · 夜钟</div>
        </div>

        <div className="xy-route" aria-label="四段泊舟夜行阅读">
          <div className="xy-route-line" aria-hidden="true" />
          {stations.map((item, index) => (
            <button
              key={item.mark}
              className={`xy-station ${station === index ? "is-active" : ""}`}
              onClick={() => setStation(index)}
              aria-current={station === index ? "step" : undefined}
            >
              <span className="xy-dot" />
              <b>{item.mark}</b>
              <small>{item.cue}</small>
            </button>
          ))}
        </div>

        <div className="xy-verse" aria-live="polite">
          <div className="xy-verse-head">
            <span>{String(station + 1).padStart(2, "0")}</span>
            <small>{stations[station].label}</small>
          </div>
          <div className="xy-couplet">
            {activeLines.map((lineIndex) => (
              <button key={poem.lines[lineIndex]} onClick={() => setDetail(`note-${lineIndex}`)}>
                <span>{poem.lines[lineIndex]}</span>
                <small>{poem.notes[lineIndex].term}</small>
              </button>
            ))}
          </div>
          <p className="xy-note-preview">{poem.notes[activeLines[0]].text}</p>
          <button className="xy-note-link" onClick={() => setDetail(`note-${activeLines[0]}`)}>展开这一泊的注释</button>
        </div>

        <aside className="xy-bell" aria-label="夜色进程">
          <MoonStars size={18} />
          <span>暮</span>
          <i style={{ "--xy-progress": `${(station + 1) * 25}%` }} />
          <span>夜</span>
          <em>{stations[station].cue}</em>
        </aside>
      </section>

      <nav className="xy-tools" aria-label="作品学习工具">
        <button onClick={() => setDetail("translation")}>译文</button>
        <button onClick={() => setDetail("appreciation")}>赏析</button>
        <button onClick={() => { setStudy("recitation"); setReciteIndex(0); setHidden(false); }}><Feather size={16} /> 背诵</button>
        <button onClick={() => { setStudy("dictation"); setAnswers(poem.lines.map(() => "")); setChecked(false); }}>默写</button>
      </nav>

      {detail && <div className="xy-layer" role="dialog" aria-modal="true" aria-label="作品说明">
        <button className="xy-scrim" onClick={() => setDetail(null)} aria-label="关闭" />
        <section className="xy-sheet">
          <header>
            <div>
              <small>{detail.startsWith("note-") ? "逐句注释" : detail === "translation" ? "今译" : "赏析"}</small>
              <h2>{detail.startsWith("note-") ? poem.notes[Number(detail.split("-")[1])].term : poem.title}</h2>
            </div>
            <button onClick={() => setDetail(null)} aria-label="关闭"><X size={18} /></button>
          </header>
          <p>{detail.startsWith("note-") ? poem.notes[Number(detail.split("-")[1])].text : detail === "translation" ? poem.translation : poem.appreciation}</p>
        </section>
      </div>}

      {study && <div className="xy-layer" role="dialog" aria-modal="true" aria-label={`${poem.title}${study === "dictation" ? "默写" : "背诵"}`}>
        <button className="xy-scrim" onClick={() => setStudy(null)} aria-label="关闭学习层" />
        <section className="xy-study-sheet">
          <header><button onClick={() => setStudy(null)}><ArrowLeft size={17} /> 回到泊舟夜</button><span>{study === "dictation" ? "默写" : "背诵"}</span></header>
          {study === "recitation" ? (
            <div className="xy-recite">
              <small>{reciteIndex + 1} / {poem.lines.length} · {poem.notes[reciteIndex].term}</small>
              <button className={hidden ? "is-hidden" : ""} onClick={() => setHidden((value) => !value)}>{poem.lines[reciteIndex]}</button>
              <p>{hidden ? poem.studyCopy.recitationHint : poem.notes[reciteIndex].text}</p>
              <div><button onClick={() => setHidden((value) => !value)}>{hidden ? "显出原文" : "覆去原文"}</button><button onClick={nextRecitation}>{reciteIndex === poem.lines.length - 1 ? "完成背诵" : "听下一句"}</button></div>
            </div>
          ) : (
            <div className="xy-dictation">
              <h2>{poem.studyCopy.dictationTitle}</h2>
              <div className="xy-input-grid">
                {poem.lines.map((line, index) => {
                  const correct = normalize(answers[index]) === normalize(line);
                  return <label key={line}><span>{index + 1} · {poem.notes[index].term}</span><input value={answers[index]} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setChecked(false); }} placeholder="默写本句" />{checked && (correct ? <Check size={17} /> : <small>{line}</small>)}</label>;
                })}
              </div>
              {checked && <p>{score === poem.lines.length ? poem.studyCopy.dictationSuccess : `写对 ${score} 句，继续核对。`}</p>}
              <button className="xy-submit" onClick={checkDictation}>核对默写</button>
            </div>
          )}
        </section>
      </div>}

      <aside className={`xy-history ${history ? "is-open" : ""}`} aria-hidden={!history} inert={history ? undefined : true}>
        <header><div><small>已读 · {poems.length} 篇</small><h2>往日篇章</h2></div><button onClick={() => setHistory(false)} aria-label="关闭历史"><X size={20} /></button></header>
        <div>{poems.map((item) => <button key={item.id} onClick={() => { setHistory(false); onNavigate(item.id); }}><List size={15} /><span><strong>{item.title}</strong><small>{item.dynasty} · {item.author}{item.genre ? ` · ${item.genre}` : ""}</small></span></button>)}</div>
      </aside>
    </main>
  );
}
