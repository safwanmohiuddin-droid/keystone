"use client";

import { useEffect, useState } from "react";
import { DeviceMobile, Laptop } from "@phosphor-icons/react";

const beats = [
  {
    device: "laptop" as const,
    ask: "Share sample passport",
    line: "Laptop: please share a sample passport page. Nothing is uploaded.",
  },
  {
    device: "phone" as const,
    ask: "Confirm on your phone",
    line: "Phone: approve the sample passport share.",
  },
  {
    device: "laptop" as const,
    ask: "Share salary letter",
    line: "Laptop: share the sample salary letter so the name can be checked.",
  },
  {
    device: "phone" as const,
    ask: "Confirm the letter",
    line: "Phone: the sample letter matches the passport. Pack is ready.",
  },
];

export function BankAgent() {
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<string[]>([
    "I’ll guide the bank step. Every prompt here is simulated.",
  ]);
  const done = index >= beats.length;
  const current = beats[Math.min(index, beats.length - 1)];

  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => {
      setLog((prev) => {
        const line = current.line;
        return prev[prev.length - 1] === line ? prev : [...prev, line];
      });
    }, 600);
    return () => window.clearTimeout(id);
  }, [index, done, current.line]);

  function advance() {
    if (done) return;
    setLog((prev) => [...prev, `You: ${current.ask}`]);
    setIndex((value) => value + 1);
  }

  return (
    <section className="bank-agent" aria-live="polite">
      <div className="bank-agent-head">
        <span className="demo-pill">Simulated agent</span>
        <h2>Open the sample bank account</h2>
        <p>
          The checklist stays as it is. This agent only pretends to ping your
          laptop and phone for a passport and a salary letter.
        </p>
      </div>
      <div className="bank-agent-grid">
        <div className="agent-log">
          {log.map((line, i) => (
            <p key={`${i}-${line}`}>{line}</p>
          ))}
          {done ? (
            <p className="agent-done">
              Sample documents are in. Use “I did this” above when you want the
              checklist to move on.
            </p>
          ) : (
            <button className="button primary" type="button" onClick={advance}>
              {current.ask}
            </button>
          )}
        </div>
        <div className="agent-devices">
          <article
            className={`agent-device ${!done && current.device === "laptop" ? "is-live" : ""}`}
          >
            <Laptop size={18} />
            <strong>Laptop</strong>
            {!done && current.device === "laptop" ? (
              <div className="agent-push" role="status">
                {current.ask}
              </div>
            ) : (
              <span>{done ? "Pack received" : "Waiting"}</span>
            )}
          </article>
          <article
            className={`agent-device phone ${!done && current.device === "phone" ? "is-live" : ""}`}
          >
            <DeviceMobile size={18} />
            <strong>Phone</strong>
            {!done && current.device === "phone" ? (
              <div className="agent-push" role="status">
                {current.ask}
              </div>
            ) : (
              <span>{done ? "Confirmed" : "Waiting"}</span>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
