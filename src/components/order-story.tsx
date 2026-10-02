"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { criticalPath, getSteps } from "@/lib/graph";
import type { Lane } from "@/data";

const laneOrder: Lane[] = ["visa", "money", "home", "family", "car"];
const laneName: Record<Lane, { en: string; ar: string }> = {
  visa: { en: "Visa & ID", ar: "التأشيرة" },
  money: { en: "Money", ar: "المال" },
  home: { en: "Home", ar: "المنزل" },
  family: { en: "Family", ar: "العائلة" },
  car: { en: "Car", ar: "السيارة" },
};

const chipLabel: Record<string, { en: string; ar: string }> = {
  entry_permit: { en: "Entry", ar: "الدخول" },
  arrival: { en: "Arrival", ar: "الوصول" },
  medical_test: { en: "Medical", ar: "الفحص" },
  eid_biometrics: { en: "Biometrics", ar: "البصمة" },
  residence_visa: { en: "Residence", ar: "الإقامة" },
  eid_card: { en: "Emirates ID", ar: "الهوية" },
  local_sim: { en: "SIM", ar: "الشريحة" },
  bank_account: { en: "Bank", ar: "البنك" },
  salary_transfer: { en: "Salary", ar: "الراتب" },
  chequebook: { en: "Cheques", ar: "الشيكات" },
  temp_stay: { en: "Temp stay", ar: "سكن مؤقت" },
  apartment_search: { en: "Home search", ar: "البحث" },
  lease_and_cheques: { en: "Lease", ar: "العقد" },
  tawtheeq: { en: "Tawtheeq", ar: "توثيق" },
  utilities: { en: "Utilities", ar: "الخدمات" },
  internet: { en: "Internet", ar: "الإنترنت" },
  dependent_visas: { en: "Family visas", ar: "تأشيرات" },
  dependent_eids: { en: "Family IDs", ar: "هويات" },
  family_insurance: { en: "Insurance", ar: "التأمين" },
  school_enrollment: { en: "School", ar: "المدرسة" },
  eye_test: { en: "Eye test", ar: "النظر" },
  car_purchase: { en: "Vehicle", ar: "المركبة" },
  car_registration: { en: "Registration", ar: "التسجيل" },
  driving_training: { en: "Training", ar: "التدريب" },
  driving_ready: { en: "Licence", ar: "الرخصة" },
};

function Chip({
  label,
  index,
  lane,
  slot,
  critical,
  keystone,
  spread,
  shift,
  gold,
  stageWidth,
}: {
  label: string;
  index: number;
  lane: number;
  slot: number;
  critical: boolean;
  keystone: boolean;
  spread: MotionValue<number>;
  shift: MotionValue<number>;
  gold: MotionValue<number>;
  stageWidth: number;
}) {
  const col = Math.max(108, (stageWidth - 8) / 5);
  const x = useTransform(() => {
    const from = Math.min(280, stageWidth * 0.22);
    const to = lane * col;
    return from + (to - from) * spread.get();
  });
  const y = useTransform(() => {
    const from = 8 + index * 40 - shift.get();
    const to = 36 + slot * 48;
    const s = spread.get();
    return from + (to - from) * s;
  });
  const border = useTransform(gold, (value) =>
    keystone
      ? `rgba(212, 170, 79, ${0.35 + value * 0.65})`
      : "rgba(217, 195, 160, 0.22)",
  );

  return (
    <motion.div className={`order-chip${critical ? " on-path" : ""}`} style={{ x, y, width: col - 10, borderColor: border }}>
      {label}
    </motion.div>
  );
}

export default function OrderStory({ ar }: { ar: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [stageWidth, setStageWidth] = useState(900);
  const [weeks, setWeeks] = useState(11);
  const [phase, setPhase] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const spread = useTransform(scrollYProgress, [0.18, 0.72], [0, 1]);
  const shift = useTransform(scrollYProgress, [0.02, 0.2], [0, 260]);
  const gold = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 1]);
  const plan = getSteps("priya");
  const critical = new Set(criticalPath("priya"));
  const slots: Record<string, number> = {};
  const chips = plan.map((step, index) => {
    const slot = slots[step.lane] ?? 0;
    slots[step.lane] = slot + 1;
    return { step, index, lane: Math.max(0, laneOrder.indexOf(step.lane as Lane)), slot };
  });
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const lang = ar ? "ar" : "en";

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setPhase(value < 0.2 ? 0 : value < 0.72 ? 1 : 2);
    const mix = Math.min(1, Math.max(0, (value - 0.62) / 0.3));
    setWeeks(Math.round(11 - mix * 6));
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    const stage = stageRef.current;
    const measure = () => setStageWidth(stage?.clientWidth || 900);
    measure();
    const observer = new ResizeObserver(measure);
    if (stage) observer.observe(stage);
    return () => {
      mq.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, []);

  const caption =
    phase === 0
      ? t("One long line. Eleven slow weeks.", "خط واحد. أحد عشر أسبوعاً بطيئاً.")
      : phase === 1
        ? t("Watch the line break into lanes.", "شاهد الخط ينقسم إلى مسارات.")
        : t("Same steps. The ones that can run together, do.", "الخطوات نفسها. ما يمكن أن يتم معاً، يتم.");

  if (reduce || narrow) {
    return (
      <section id="order" data-section="order" className="story-block">
        <div className="story-kicker">
          <p>{t("Five lanes, not one queue.", "خمسة مسارات، لا طابور واحد.")}</p>
          <strong>
            5 <small>{t("weeks, illustrative", "أسابيع، توضيحي")}</small>
          </strong>
        </div>
        <div className="order-lanes">
          {laneOrder.map((lane) => (
            <div key={lane}>
              <h3>{laneName[lane][lang]}</h3>
              {plan
                .filter((step) => step.lane === lane)
                .map((step) => (
                  <p key={step.id} className={critical.has(step.id) ? "on-path" : ""}>
                    {chipLabel[step.id]?.[lang] ?? step.title[lang]}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="order" data-section="order" ref={ref} className="story-pin story-pin-tall">
      <div className="story-sticky">
        <div className="story-kicker">
          <p>{caption}</p>
          <strong>
            {weeks}
            <small>{t("weeks, illustrative", "أسابيع، توضيحي")}</small>
          </strong>
        </div>
        <div className="order-stage" ref={stageRef}>
          <motion.div className="lane-names" style={{ opacity: labelOpacity }}>
            {laneOrder.map((lane) => (
              <span key={lane}>{laneName[lane][lang]}</span>
            ))}
          </motion.div>
          {chips.map((chip) => (
            <Chip
              key={chip.step.id}
              label={chipLabel[chip.step.id]?.[lang] ?? chip.step.title[lang]}
              index={chip.index}
              lane={chip.lane}
              slot={chip.slot}
              critical={critical.has(chip.step.id)}
              keystone={chip.step.id === "bank_account"}
              spread={spread}
              shift={shift}
              gold={gold}
              stageWidth={stageWidth}
            />
          ))}
        </div>
        <p className="story-note">
          {t(
            "Priya’s sample. Scroll to move each stone from the queue into its lane.",
            "عينة بريا. مرر لتنقل كل حجر من الطابور إلى مساره.",
          )}
        </p>
      </div>
    </section>
  );
}
