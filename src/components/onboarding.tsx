"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Check,
  Sparkle,
} from "@phosphor-icons/react";
import Brand from "./brand";
import Arch from "./arch";
import { personas } from "@/data";
export default function Onboarding() {
  const [stage, setStage] = useState(0),
    [persona, setPersona] = useState("priya");
  const p = personas.find((p) => p.id === persona)!;
  return (
    <main className="onboarding marble">
      <header className="site-header">
        <Brand />
        <Link className="text-button" href="/">
          Back to the idea
        </Link>
        <span className="demo-pill">Sample walkthrough</span>
      </header>
      <div className="onboarding-layout">
        <aside>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1>
            Let’s lay
            <br />
            <em>the first stone.</em>
          </h1>
          <p>
            Three small steps.
            <br />
            One clearer way forward.
          </p>
          <Arch small />
          <ol className="onboard-steps">
            {[
              "Meet your sample documents",
              "A little about your move",
              "See your unlock order",
            ].map((s, i) => (
              <li
                key={s}
                className={i === stage ? "active" : i < stage ? "done" : ""}
              >
                <span>
                  {i < stage ? (
                    <Check size={15} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </aside>
        <section className="onboard-content">
          <span className="eyebrow">STEP {stage + 1} OF 3</span>
          {stage === 0 ? (
            <>
              <h2>
                Start with the pieces
                <br />
                <em>you already have.</em>
              </h2>
              <p>
                For this preview, we’ve prepared a fictional passport, offer
                letter and arrival booking.
              </p>
              <div className="sample-docs">
                {[
                  "Sample passport",
                  "Sample offer letter",
                  "Sample arrival booking",
                ].map((d, i) => (
                  <div key={d}>
                    <FileText size={25} />
                    <div>
                      <strong>{d}</strong>
                      <span>
                        Fictional document ·{" "}
                        {i === 0
                          ? "Identity"
                          : i === 1
                            ? "Employment"
                            : "Arrival"}
                      </span>
                    </div>
                    <Check size={18} />
                  </div>
                ))}
              </div>
              <div className="info-note">
                <Sparkle size={20} />
                <p>
                  Sample extracts are ready. This preview doesn’t upload or
                  process your personal documents.
                </p>
              </div>
              <button className="button primary" onClick={() => setStage(1)}>
                Use sample documents <ArrowRight size={18} />
              </button>
            </>
          ) : stage === 1 ? (
            <>
              <h2>
                Every beginning
                <br />
                <em>is a little different.</em>
              </h2>
              <p>
                Choose a sample journey. We’ll adapt the family and driving
                steps to match.
              </p>
              <div className="journey-options">
                {personas.map((person) => (
                  <button
                    key={person.id}
                    className={persona === person.id ? "selected" : ""}
                    onClick={() => setPersona(person.id)}
                    aria-pressed={persona === person.id}
                  >
                    <span className="avatar">{person.name.charAt(0)}</span>
                    <span>
                      <strong>{person.name.split(" ")[0]}</strong>
                      <small>{person.bio.en}</small>
                    </span>
                    <span className="radio-dot">
                      {persona === person.id && <Check size={12} />}
                    </span>
                  </button>
                ))}
              </div>
              <div className="button-row">
                <button className="text-button" onClick={() => setStage(0)}>
                  <ArrowLeft />
                  Back
                </button>
                <button className="button primary" onClick={() => setStage(2)}>
                  Create sample plan <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="ready-symbol">
                <Check size={32} />
              </span>
              <h2>
                Many moving parts.
                <br />
                <em>One next step.</em>
              </h2>
              <p>
                {p.name.split(" ")[0]}’s plan is ready. Your preview starts on
                day 5, with the ID steps behind you and banking up next.
              </p>
              <div className="assembled">
                <span>VISA & ID</span>
                <span>MONEY</span>
                <span>HOME</span>
                {p.hasFamily && <span>FAMILY</span>}
                {p.hasCar && <span>CAR</span>}
              </div>
              <div className="info-note">
                <Sparkle size={20} />
                <p>
                  The order comes from demo dependency rules. Confirm actual
                  requirements with your employer and service providers.
                </p>
              </div>
              <div className="button-row">
                <button className="text-button" onClick={() => setStage(1)}>
                  <ArrowLeft />
                  Back
                </button>
                <Link className="button primary" href={`/app?persona=${p.id}`}>
                  Enter your workspace <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
