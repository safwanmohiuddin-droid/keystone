"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { getSteps } from "@/lib/graph";
import type { Lane } from "@/data";

const spaces: {
  lane: Lane;
  title: string;
  line: string;
  tone: string;
}[] = [
  {
    lane: "visa",
    title: "Identity",
    line: "Entry, medical test, and Emirates ID.",
    tone: "space-identity",
  },
  {
    lane: "money",
    title: "Money",
    line: "Bank account, salary, and cheques.",
    tone: "space-money",
  },
  {
    lane: "home",
    title: "Home",
    line: "A place to stay, a lease, and utilities.",
    tone: "space-home",
  },
  {
    lane: "family",
    title: "Family",
    line: "Visas, school, and insurance.",
    tone: "space-family",
  },
  {
    lane: "car",
    title: "Mobility",
    line: "Licence, vehicle, and registration.",
    tone: "space-mobility",
  },
];

export default function Landing() {
  const [query, setQuery] = useState("");
  const [ar, setAr] = useState(false);
  const steps = getSteps("priya");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return steps.filter((step) => {
      if (!q) return true;
      return (
        step.title.en.toLowerCase().includes(q) ||
        step.title.ar.includes(query.trim()) ||
        step.lane.includes(q)
      );
    });
  }, [query, steps]);
  const t = (en: string, arabic: string) => (ar ? arabic : en);

  return (
    <main className="portal" dir={ar ? "rtl" : "ltr"} lang={ar ? "ar" : "en"}>
      <header className="portal-bar">
        <Link href="/" className="portal-mark" aria-label="Keystone home">
          <span className="portal-mark-badge" aria-hidden="true" />
          Keystone
        </Link>
        <nav aria-label="Primary">
          <Link href="/app">{t("My plan", "خطتي")}</Link>
          <a href="#services">{t("Steps", "الخطوات")}</a>
          <Link href="/app/city">{t("City", "المدينة")}</Link>
          <a href="#support">{t("Support", "الدعم")}</a>
        </nav>
        <div className="portal-bar-actions">
          <button type="button" onClick={() => setAr(!ar)}>
            {ar ? "English" : "العربية"}
          </button>
          <Link href="/start" className="portal-signin">
            {t("Begin", "ابدأ")}
          </Link>
        </div>
      </header>

      <section className="portal-hero">
        <div className="portal-ribbons" aria-hidden="true" />
        <div className="portal-hero-copy">
          <h1>
            {t("Your first months", "أشهرك الأولى")}
            <br />
            {t("in Abu Dhabi", "في أبوظبي")}
          </h1>
          <p>
            {t(
              "One sample plan that puts visa, money, home, family, and car in an order you can follow.",
              "خطة تجريبية ترتب التأشيرة والمال والمنزل والعائلة والسيارة بترتيب يمكنك اتباعه.",
            )}
          </p>
          <form
            className="portal-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <MagnifyingGlass size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search the sample steps", "ابحث في الخطوات التجريبية")}
              aria-label={t("Search the sample steps", "ابحث في الخطوات التجريبية")}
            />
          </form>
        </div>
      </section>

      <section className="portal-spaces" aria-labelledby="spaces-title">
        <h2 id="spaces-title">{t("Your spaces", "مساحاتك")}</h2>
        <div className="portal-space-row">
          {spaces.map((space) => (
            <Link key={space.lane} href="/app?persona=priya" className={space.tone}>
              <strong>{space.title}</strong>
              <span>{space.line}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="portal-services" id="services" aria-labelledby="services-title">
        <h2 id="services-title">{t("List of steps", "قائمة الخطوات")}</h2>
        {visible.length === 0 ? (
          <p className="portal-empty">
            {t("No sample step matches that search.", "لا توجد خطوة تجريبية تطابق البحث.")}
          </p>
        ) : (
          <div className="portal-service-grid">
            {visible.map((step) => (
              <Link key={step.id} href="/app?persona=priya">
                <strong>{step.title[ar ? "ar" : "en"]}</strong>
                <span>
                  {spaces.find((space) => space.lane === step.lane)?.title} ·{" "}
                  {step.typicalDays} {t("demo days", "أيام تجريبية")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="portal-support" id="support">
        <div>
          <h2>{t("A guide, not a government service.", "دليل، وليس خدمة حكومية.")}</h2>
          <p>
            {t(
              "Keystone lines up a fictional first plan and hands you toward the provider when a step lives there. Confirm every requirement yourself.",
              "يرتب كيستون خطة أولى خيالية ويوجهك إلى الجهة عندما تكون الخطوة لديها. أكد كل متطلب بنفسك.",
            )}
          </p>
        </div>
        <Link href="/start" className="portal-signin">
          {t("Begin with Priya’s sample", "ابدأ بعينة بريا")} <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
