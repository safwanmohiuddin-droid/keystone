"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  WarningCircle,
} from "@phosphor-icons/react";
import { cityInsights, steps } from "@/data";
import Brand from "./brand";
export default function City() {
  const [selected, setSelected] = useState(cityInsights.districts[0]);
  return (
    <main className="city-page marble">
      <header className="site-header">
        <Brand />
        <Link className="text-button" href="/app">
          <ArrowLeft size={16} />
          Your journey
        </Link>
        <span className="demo-pill">Synthetic city cohort</span>
      </header>
      <section className="city-heading">
        <span className="eyebrow">MANY BEGINNINGS. ONE CITY.</span>
        <h1>
          Where life
          <br />
          <em>gets held up.</em>
        </h1>
        <p>
          A view of {cityInsights.population} generated relocation journeys.
          <br />
          Explore patterns in fictional data, not Abu Dhabi statistics.
        </p>
      </section>
      <div className="city-grid">
        <section className="district-map">
          <div className="map-water-label">ARABIAN GULF</div>
          <div className="districts">
            {cityInsights.districts.map((d, i) => (
              <button
                key={d.district}
                className={`district district-${i} ${selected.district === d.district ? "selected" : ""}`}
                onClick={() => setSelected(d)}
                aria-pressed={selected.district === d.district}
              >
                <MapPin size={20} />
                <strong>{d.district}</strong>
                <span>{d.cases} sample cases</span>
              </button>
            ))}
          </div>
          <div className="map-disclaimer">
            District diagram · symbolic geography
          </div>
        </section>
        <aside className="city-detail">
          <span className="eyebrow">SELECTED DISTRICT</span>
          <h2>{selected.district}</h2>
          <div className="city-stats">
            <div>
              <strong>{selected.cases}</strong>
              <span>Generated cases</span>
            </div>
            <div>
              <strong>{selected.blockedCases}</strong>
              <span>Cases with a blocker</span>
            </div>
          </div>
          <h3>Across the sample cohort</h3>
          {cityInsights.blockers.map((b) => (
            <div className="city-blocker" key={b.id}>
              <WarningCircle size={18} />
              <span>{b.id.replaceAll("-", " ")}</span>
              <strong>{b.count}</strong>
            </div>
          ))}
          <p className="assumption">
            Generated with seed 71026. These counts describe our demo fixtures,
            not real residents or providers.
          </p>
        </aside>
      </div>
      <section className="city-duration">
        <h2>A closer look at the steps.</h2>
        <p>Median duration in the generated cases. Not a service commitment.</p>
        <div>
          {cityInsights.medianDaysPerStep.slice(0, 8).map((s) => (
            <article key={s.stepId}>
              <span>
                {steps.find((step) => step.id === s.stepId)?.title.en ??
                  s.stepId}
              </span>
              <strong>
                {s.medianDays}
                <small>demo days</small>
              </strong>
            </article>
          ))}
        </div>
      </section>
      <footer className="app-footer">
        <Link className="text-button" href="/start">
          Explore a sample journey
          <ArrowUpRight size={16} />
        </Link>
        <span>Fictional demo · no live city data</span>
      </footer>
    </main>
  );
}
