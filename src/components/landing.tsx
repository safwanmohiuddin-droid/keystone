"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Arch from "./arch";
import Brand from "./brand";
import DuneShader from "./dune-shader";
import HoldToChange from "./hold-to-change";
import OrderStory from "./order-story";
import { cityInsights, personas } from "@/data";
import { getSteps, nextStep } from "@/lib/graph";

const sections = [
  { id: "intro", en: "Intro", ar: "البداية" },
  { id: "problem", en: "Problem", ar: "المشكلة" },
  { id: "order", en: "Order", ar: "الترتيب" },
  { id: "you", en: "You", ar: "أنت" },
  { id: "demo", en: "Demo", ar: "التجربة" },
  { id: "trust", en: "Trust", ar: "الوضوح" },
  { id: "city", en: "City", ar: "المدينة" },
  { id: "begin", en: "Begin", ar: "ابدأ" },
];

const lines = [
  {
    lead: { en: "You need an Emirates ID", ar: "تحتاج هوية إماراتية" },
    rest: { en: "to open a bank account.", ar: "لتفتح حساباً بنكياً." },
  },
  {
    lead: { en: "You need a bank account", ar: "تحتاج حساباً بنكياً" },
    rest: { en: "for rent cheques.", ar: "لشيكات الإيجار." },
  },
  {
    lead: { en: "You need a lease", ar: "تحتاج عقد إيجار" },
    rest: { en: "for everything else.", ar: "لكل ما يلي ذلك." },
  },
];

const faqs = [
  {
    q: { en: "Isn’t this what TAMM does?", ar: "أليس هذا ما يفعله تَم؟" },
    a: {
      en: "TAMM organizes Abu Dhabi government services. Keystone lines up your first 90 days across federal, emirate, private, and personal steps, and hands you to TAMM when a step lives there.",
      ar: "ينظم تَم خدمات حكومة أبوظبي. يرتب كيستون أيامك التسعين الأولى عبر الجهات الاتحادية والمحلية والخاصة والشخصية، ثم يسلمك إلى تَم عندما تكون الخطوة هناك.",
    },
  },
  {
    q: { en: "Where does the order come from?", ar: "من أين يأتي الترتيب؟" },
    a: {
      en: "A curated sample rules engine, not a live reading of the law. Every step in the workspace is marked demo data. Confirm it with the provider.",
      ar: "محرك قواعد تجريبي، وليس قراءة حية للقانون. كل خطوة في مساحة العمل معلّمة كبيانات تجريبية. أكدها مع الجهة.",
    },
  },
  {
    q: { en: "What happens to my documents?", ar: "ماذا يحدث لمستنداتي؟" },
    a: {
      en: "Nothing. This version never uploads a file. The facts you see are fictional samples stored in the page.",
      ar: "لا شيء. هذا الإصدار لا يرفع أي ملف. الحقائق التي تراها عينات خيالية داخل الصفحة.",
    },
  },
  {
    q: { en: "What if something goes wrong?", ar: "ماذا لو تعطل شيء؟" },
    a: {
      en: "Say what stalled. The plan pauses that step and points at the next thing you can still do.",
      ar: "قل ما الذي توقف. توقف الخطة تلك الخطوة وتشير إلى ما يزال بإمكانك فعله.",
    },
  },
  {
    q: { en: "Who pays for this?", ar: "من يدفع؟" },
    a: {
      en: "In the product idea, employers and relocation teams pay. The newcomer does not. This preview is free to click through.",
      ar: "في فكرة المنتج، تدفع فرق أصحاب العمل والانتقال. الوافد لا يدفع. هذه المعاينة مجانية للتجربة.",
    },
  },
];

const dayFive = [
  "entry_permit",
  "arrival",
  "temp_stay",
  "medical_test",
  "local_sim",
  "eid_biometrics",
  "apartment_search",
  "family_insurance",
  "residence_visa",
  "eid_card",
];

export default function Landing() {
  const [ar, setAr] = useState(false);
  const [active, setActive] = useState("intro");
  const [person, setPerson] = useState(0);
  const [shifted, setShifted] = useState(false);
  const [stone, setStone] = useState<"floating" | "dropping" | "set">("floating");
  const [done, setDone] = useState<string[]>(dayFive);
  const [openFaq, setOpenFaq] = useState(0);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const line0 = useTransform(problemProgress, [0.08, 0.22], [0, 1]);
  const line1 = useTransform(problemProgress, [0.28, 0.42], [0, 1]);
  const line2 = useTransform(problemProgress, [0.48, 0.62], [0, 1]);
  const stat = useTransform(problemProgress, [0.7, 0.86], [0, 1]);
  const fades = [line0, line1, line2];
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const persona = personas[person];
  const planSize = getSteps(persona.id).length;
  const previousSize = getSteps(personas[(person + personas.length - 1) % personas.length].id).length;
  const delta = planSize - previousSize;
  const next = nextStep("priya", done);
  const maxBlock = Math.max(...cityInsights.blockers.map((b) => b.count));

  useMotionValueEvent(heroProgress, "change", (value) => {
    if (reduce) return;
    if (value > 0.16) setStone((current) => (current === "floating" ? "dropping" : current));
  });

  useEffect(() => {
    if (reduce) setStone("set");
    const onScroll = () => {
      const marker = window.innerHeight * 0.32;
      let current = "intro";
      for (const section of sections) {
        const node = document.getElementById(section.id);
        if (node && node.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, [reduce]);

  return (
    <main className="story night" dir={ar ? "rtl" : "ltr"} lang={ar ? "ar" : "en"}>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <header className="story-header">
        <Brand />
        <div className="story-header-actions">
          <button type="button" className="language-button" onClick={() => setAr(!ar)}>
            {ar ? "English" : "العربية"}
          </button>
          <Link href="/start" className="button light">
            {t("Begin", "ابدأ")} <ArrowRight size={16} />
          </Link>
        </div>
      </header>
      <nav className="section-index" aria-label={t("On this page", "في هذه الصفحة")}>
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className={active === section.id ? "active" : ""}>
            {section[ar ? "ar" : "en"]}
          </a>
        ))}
      </nav>

      <section id="intro" data-section="intro" ref={heroRef} className="story-pin">
        <div className="story-sticky hero-sticky">
          <DuneShader />
          <div className="hero-copy">
            <h1>
              {t("Everyone gets the checklist.", "الجميع يحصل على القائمة.")}
              <em> {t("Keystone gives you the order.", "كيستون يعطيك الترتيب.")}</em>
            </h1>
            <p className="arabic-display" lang="ar" dir="rtl">
              حياة جديدة في أبوظبي. خطوة واحدة تفتح ما بعدها.
            </p>
            <div className="hero-actions">
              <Link className="button light" href="/start">
                {t("Begin with Priya’s sample", "ابدأ بعينة بريا")} <ArrowRight size={16} />
              </Link>
              <a className="text-button" href="#order">
                {t("See the order change", "شاهد تغير الترتيب")}
              </a>
            </div>
            <p className="story-note">
              {reduce
                ? t("The keystone is already set.", "حجر العقد في مكانه.")
                : t("Scroll to set the keystone.", "مرر لتضع حجر العقد.")}
            </p>
          </div>
          <div className="hero-art">
            <Arch
              progress={stone === "set" ? 70 : 40}
              keystoneState={stone}
              onSettled={() => setStone("set")}
            />
          </div>
        </div>
      </section>

      <section id="problem" data-section="problem" ref={problemRef} className="story-pin">
        <div className="story-sticky problem-sticky">
          <div>
            {lines.map((line, index) => (
              <motion.p
                key={line.lead.en}
                className="staccato"
                style={{ opacity: reduce || index === 0 ? 1 : fades[index] }}
              >
                <em>{line.lead[ar ? "ar" : "en"]}</em> {line.rest[ar ? "ar" : "en"]}
              </motion.p>
            ))}
          </div>
          <motion.div className="giant-stat" style={{ opacity: reduce ? 1 : stat }}>
            <strong>5–8</strong>
            <span>
              {t(
                "Weeks typically lost to the wrong order. Illustrative, not a measured result.",
                "أسابيع تضيع عادة بسبب الترتيب الخاطئ. رقم توضيحي، وليس نتيجة مقاسة.",
              )}
            </span>
          </motion.div>
        </div>
      </section>

      <OrderStory ar={ar} />

      <section id="you" data-section="you" className="story-block you-block">
        <div>
          <h2>
            {t("Same city. Same rules.", "المدينة نفسها. القواعد نفسها.")}
            <em> {t("A different order.", "ترتيب مختلف.")}</em>
          </h2>
          <p className="story-lead">
            {persona.bio[ar ? "ar" : "en"]} {persona.role}. {persona.district}.
          </p>
          <p className="persona-facts">
            {persona.displayName} · {planSize} {t("steps", "خطوات")}
            {shifted && delta !== 0 && (
              <span>
                {" "}
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
            )}
          </p>
          <div className="persona-switch" role="group" aria-label={t("Sample people", "أشخاص تجريبيون")}>
            {personas.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={person === index}
                className={person === index ? "active" : ""}
                onClick={() => {
                  setShifted(true);
                  setPerson(index);
                }}
              >
                {item.displayName}
              </button>
            ))}
          </div>
          <HoldToChange
            label={t("Click and hold to become someone else.", "انقر مع الاستمرار لتصبح شخصاً آخر.")}
            onComplete={() => {
              setShifted(true);
              setPerson((index) => (index + 1) % personas.length);
            }}
          />
          <Link className="text-button" href={`/app?persona=${persona.id}`}>
            {t(`Open ${persona.displayName}’s workspace`, `افتح مساحة ${persona.displayName}`)}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
        <ul className="you-lanes">
          {["visa", "money", "home", "family", "car"].map((lane) => {
            const count = getSteps(persona.id).filter((step) => step.lane === lane).length;
            if (!count) return null;
            const label = { visa: ["Visa & ID", "التأشيرة"], money: ["Money", "المال"], home: ["Home", "المنزل"], family: ["Family", "العائلة"], car: ["Car", "السيارة"] }[lane]!;
            return (
              <li key={lane}>
                <span>{t(label[0], label[1])}</span>
                <strong>{count}</strong>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="demo" data-section="demo" className="story-block demo-block">
        <div className="demo-frame">
          <header>
            <span>{t("Priya · sample day 5", "بريا · اليوم الخامس التجريبي")}</span>
            <span>{t("Demo mode", "وضع تجريبي")}</span>
          </header>
          {next ? (
            <>
              <p className="demo-kicker">{t("Do this next", "افعل هذا الآن")}</p>
              <h2>{next.title[ar ? "ar" : "en"]}</h2>
              <p>
                {t(
                  "It is ready, and it opens more of the plan than anything else waiting.",
                  "هذه الخطوة جاهزة، وتفتح من الخطة أكثر من أي خطوة أخرى بانتظارك.",
                )}
              </p>
              <button
                type="button"
                className="button light"
                onClick={() => setDone((items) => [...items, next.id])}
              >
                {t("I did this", "أنجزت هذه الخطوة")}
              </button>
            </>
          ) : (
            <>
              <h2>{t("Priya’s sample arch is standing.", "اكتمل قوس بريا التجريبي.")}</h2>
              <button type="button" className="button light" onClick={() => setDone(dayFive)}>
                {t("Replay from day 5", "أعد من اليوم الخامس")}
              </button>
            </>
          )}
          <Link href="/app?persona=priya">
            {t("Open the full workspace", "افتح مساحة العمل")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section id="trust" data-section="trust" className="story-block trust-block">
        <h2>{t("Asked before.", "سُئل من قبل.")}</h2>
        <div className="faq">
          {faqs.map((item, index) => (
            <div key={item.q.en} className={openFaq === index ? "open" : ""}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                {item.q[ar ? "ar" : "en"]}
              </button>
              {openFaq === index && <p>{item.a[ar ? "ar" : "en"]}</p>}
            </div>
          ))}
        </div>
      </section>

      <section id="city" data-section="city" className="story-block city-block">
        <div>
          <h2>
            {t("Where the sample city gets stuck.", "حيث تتعثر المدينة التجريبية.")}
          </h2>
          <p>
            {t(
              `${cityInsights.population} fictional journeys. Not Abu Dhabi statistics.`,
              `${cityInsights.population} رحلة خيالية. ليست إحصاءات أبوظبي.`,
            )}
          </p>
          <Link className="text-button" href="/app/city">
            {t("Open the city view", "افتح عرض المدينة")} <ArrowRight size={16} />
          </Link>
        </div>
        <ol className="blocker-bars">
          {cityInsights.blockers.map((blocker) => (
            <li key={blocker.id}>
              <span>{blocker.id.replaceAll("-", " ")}</span>
              <i style={{ transform: `scaleX(${blocker.count / maxBlock})` }} />
              <strong>{blocker.count}</strong>
            </li>
          ))}
        </ol>
      </section>

      <footer id="begin" data-section="begin" className="story-begin">
        <DuneShader />
        <h2>
          <em>{t("Place your first stone.", "ضع حجرك الأول.")}</em>
        </h2>
        <Link href="/start" className="button light">
          {t("Begin", "ابدأ")} <ArrowRight size={18} />
        </Link>
        <p>{t("We read the sample. We order it. You walk through it.", "نقرأ العينة. نرتبها. وأنت تسير فيها.")}</p>
      </footer>
    </main>
  );
}
