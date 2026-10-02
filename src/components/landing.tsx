"use client";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Play,
  MapPin,
  Buildings,
  IdentificationCard,
  Bank,
  House,
  Users,
  Car,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { useState } from "react";
import Arch from "./arch";
import Brand from "./brand";
import { personas } from "@/data";

export default function Landing() {
  const [persona, setPersona] = useState(0);
  const p = personas[persona];
  return (
    <main className="landing night">
      <header className="site-header">
        <Brand />
        <nav aria-label="Main">
          <a href="#the-order">The idea</a>
          <a href="#your-journey">Your journey</a>
          <span className="place">
            <MapPin size={13} /> Abu Dhabi, UAE
          </span>
        </nav>
        <Link href="/start" className="nav-cta">
          Find your next step <ArrowUpRight size={16} />
        </Link>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> A NEW CITY. A CLEARER BEGINNING.
          </div>
          <h1>
            Everyone gets
            <br />
            the checklist.
            <br />
            You get <em>the order.</em>
          </h1>
          <p>
            A new life in Abu Dhabi is built one step at a time.
            <br className="desktop-only" /> Know what comes first. And what it
            opens next.
          </p>
          <div className="hero-actions">
            <Link className="button light" href="/start">
              Begin your journey <ArrowRight size={18} />
            </Link>
            <Link className="text-button" href="/app?persona=priya">
              <span className="play-icon">
                <Play size={12} weight="fill" />
              </span>{" "}
              Meet Priya’s plan
            </Link>
          </div>
          <div className="hero-note">
            <span className="status-dot" /> An interactive prototype · built for
            Abu Dhabi
          </div>
        </div>
        <div className="hero-art">
          <span className="art-coordinate">24°27′ N &nbsp; 54°22′ E</span>
          <div className="arch-halo" />
          <Arch />
          <div className="keystone-annotation">
            <span />
            ONE RIGHT STEP
            <br />
            UNLOCKS THE NEXT.
          </div>
          <p lang="ar" dir="rtl" className="arabic-hero">
            حياة جديدة، خطوة بخطوة.
          </p>
        </div>
        <div className="hero-bottom">
          <span>YOUR LIFE, COMING TOGETHER.</span>
          <a href="#the-order">
            Explore the idea <ArrowDown size={14} />
          </a>
          <span className="hero-number">01 — 05</span>
        </div>
      </section>
      <section className="manifesto" id="the-order">
        <div className="section-label">
          <span>01 / THE MISSING PIECE</span>
          <span>LESS GUESSWORK. MORE MOMENTUM.</span>
        </div>
        <div className="manifesto-grid">
          <h2>
            It’s all connected.
            <br />
            <em>Until it isn’t.</em>
          </h2>
          <div>
            <p>
              The bank needs your ID. The lease needs your chequebook. Your
              family’s next step may depend on your home.
            </p>
            <p className="muted">
              A checklist tells you what to do. Keystone shows you how the
              pieces fit — and where to begin.
            </p>
          </div>
        </div>
        <div className="dependency-story">
          <div>
            <IdentificationCard size={28} />
            <span>01</span>
            <h3>Your identity</h3>
            <p>The foundation for what follows.</p>
          </div>
          <ArrowRight className="story-arrow" />
          <div>
            <Bank size={28} />
            <span>02</span>
            <h3>Your money</h3>
            <p>A banking route that’s ready.</p>
          </div>
          <ArrowRight className="story-arrow" />
          <div>
            <House size={28} />
            <span>03</span>
            <h3>Your home</h3>
            <p>A place for everything to start.</p>
          </div>
        </div>
        <small className="assumption">
          Illustrative sequence. Your provider and personal circumstances
          determine the actual requirements.
        </small>
      </section>
      <section className="journey-section" id="your-journey">
        <div className="section-label">
          <span>02 / ONE LIFE. FIVE THREADS.</span>
          <span lang="ar" dir="rtl">
            كل خطوة تفتح باباً
          </span>
        </div>
        <div className="journey-grid">
          <div>
            <h2>
              A plan that fits
              <br />
              <em>your beginning.</em>
            </h2>
            <p>
              You’re more than a visa application.
              <br />
              Bring your family, your ambitions and your questions. We’ll put
              the next step in focus.
            </p>
            <div
              className="persona-tabs"
              role="group"
              aria-label="Explore sample journeys"
            >
              {personas.map((person, i) => (
                <button
                  aria-pressed={persona === i}
                  onClick={() => setPersona(i)}
                  key={person.id}
                >
                  {person.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <div className="persona-bio">
              <span className="avatar">{p.name.charAt(0)}</span>
              <div>
                <strong>{p.name}</strong>
                <p>{p.bio.en}</p>
              </div>
            </div>
            <Link className="text-button" href={`/app?persona=${p.id}`}>
              Explore {p.name.split(" ")[0]}’s sample plan{" "}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="plan-preview">
            <div className="preview-header">
              <span className="eyebrow">YOUR UNLOCK ORDER</span>
              <span className="demo-pill">Demo mode</span>
            </div>
            <div className="preview-next">
              <span className="label">THE KEYSTONE</span>
              <h3>Open your bank account.</h3>
              <p>A small step. A home-sized possibility.</p>
              <span className="preview-unlocks">
                <ArrowUpRight size={15} /> Unlocks the next part of your journey
              </span>
            </div>
            <div className="preview-lanes">
              {[
                [IdentificationCard, "Visa & ID"],
                [Bank, "Money"],
                [House, "Home"],
                [Users, "Family"],
                [Car, "Car"],
              ].map(([Icon, name], i) => {
                const I = Icon as typeof Bank;
                return (
                  <div key={String(name)}>
                    <I size={18} />
                    <span>{String(name)}</span>
                    <div className="preview-stones">
                      {[0, 1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className={
                            n < i % 3
                              ? "complete"
                              : n === i % 3
                                ? "current"
                                : ""
                          }
                        >
                          {n < i % 3 ? <Check size={10} /> : null}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="preview-foot">
              <span>Different threads. One clear direction.</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>
      <section className="trust-section">
        <div className="section-label">
          <span>03 / BUILT ON CLARITY</span>
          <span>A GUIDE, WITH ITS LIMITS IN VIEW.</span>
        </div>
        <div className="trust-grid">
          <h2>
            A little certainty.
            <br />
            <em>A lot of honesty.</em>
          </h2>
          <div className="faq">
            {[
              [
                "Is this a government service?",
                "No. Keystone is an independent prototype. It helps you prepare and coordinate; the relevant authority or provider makes the actual decision.",
              ],
              [
                "What is real in this preview?",
                "The product idea and working interactions. People, documents, costs, dates and the city cohort are synthetic. They demonstrate the experience, not verified advice.",
              ],
              [
                "Can I upload my documents?",
                "This version uses sample documents only. No personal files are sent to a server. A secure document workflow would be a separate production milestone.",
              ],
              [
                "What happens when a step gets stuck?",
                "Your plan shows an alternative ready action and a recovery prompt, so one delay does not hide the work you can still do.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="closing">
        <div>
          <span className="eyebrow">04 / SEE THE BIGGER PICTURE</span>
          <h2>
            Many beginnings.
            <br />
            <em>One city.</em>
          </h2>
          <p>
            Explore a fictional relocation cohort and see
            <br />
            where the journeys get stuck.
          </p>
          <Link className="text-button" href="/app/city">
            <Buildings size={18} /> Open the city view{" "}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="city-outline" aria-hidden="true">
          <span>ABU DHABI</span>
          {Array.from({ length: 19 }, (_, i) => (
            <i key={i} style={{ height: `${28 + ((i * 37) % 120)}px` }} />
          ))}
        </div>
      </section>
      <footer>
        <Brand />
        <p>Your next chapter starts with one stone.</p>
        <Link href="/start" className="button light">
          Place your first stone <ArrowRight size={18} />
        </Link>
        <div className="footer-bottom">
          <span>MADE FOR A NEW LIFE IN ABU DHABI</span>
          <span>Synthetic demo · no live integrations</span>
          <span lang="ar" dir="rtl">
            أبوظبي، بداية جديدة
          </span>
        </div>
      </footer>
    </main>
  );
}
