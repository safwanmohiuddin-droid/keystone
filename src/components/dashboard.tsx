"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LockSimple,
  IdentificationCard,
  Bank,
  House,
  Users,
  Car,
  SquaresFour,
  Buildings,
  ArrowCounterClockwise,
  WarningCircle,
  X,
  Copy,
  Globe,
  Sun,
  Moon,
  Clock,
  FileText,
  Play,
  Pause,
} from "@phosphor-icons/react";
import {
  personas,
  steps,
  timeline,
  housingOptions,
  deadlines,
  messageTemplates,
  blockers,
  type Step,
  type Lane,
} from "@/data";
import { BankAgent } from "@/components/bank-agent";
import {
  getSteps,
  dependencies,
  descendants,
  isAvailable,
  nextStep,
  reroute,
} from "@/lib/graph";
import Arch from "./arch";
const lanes: { id: Lane; en: string; ar: string; icon: typeof Bank }[] = [
  {
    id: "visa",
    en: "Visa & ID",
    ar: "التأشيرة والهوية",
    icon: IdentificationCard,
  },
  { id: "money", en: "Money", ar: "المال", icon: Bank },
  { id: "home", en: "Home", ar: "المنزل", icon: House },
  { id: "family", en: "Family", ar: "العائلة", icon: Users },
  { id: "car", en: "Car", ar: "السيارة", icon: Car },
];
const initialDone = [
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
export default function Dashboard({ personaId }: { personaId: string }) {
  const persona = personas.find((p) => p.id === personaId) ?? personas[0];
  const [extras, setExtras] = useState<string[]>([]);
  const [stuckOpen, setStuckOpen] = useState(false);
  const plan = getSteps(persona.id, extras);
  const [done, setDone] = useState<string[]>(
      initialDone.filter((id) => plan.some((s) => s.id === id)),
    ),
    [blocked, setBlocked] = useState<string[]>([]),
    [ar, setAr] = useState(false),
    [dark, setDark] = useState(false),
    [selected, setSelected] = useState<Step | null>(null),
    [message, setMessage] = useState(""),
    [cheques, setCheques] = useState(4),
    [docReviewed, setDocReviewed] = useState(false),
    [draft, setDraft] = useState(
      persona.id === "priya" ? "name-correction" : "bank-follow-up",
    ),
    [chapter, setChapter] = useState(3),
    [playing, setPlaying] = useState(false),
    [day, setDay] = useState(5);
  const dialog = useRef<HTMLDialogElement>(null);
  const lang = ar ? "ar" : "en";
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  const next = nextStep(persona.id, done, blocked, extras);
  const remaining = plan.filter((s) => !done.includes(s.id));
  const progress = Math.round((done.length / plan.length) * 100);
  const quote = housingOptions.find(
    (q) => q.personaId === persona.id && q.chequeCount === cheques,
  )!;
  const template = messageTemplates.find((m) => m.id === draft)!;
  const money = (n: number) =>
    new Intl.NumberFormat(ar ? "ar-AE" : "en-AE").format(n);
  const open = (s: Step) => {
    setSelected(s);
    dialog.current?.showModal();
  };
  const complete = (s: Step) => {
    if (!isAvailable(persona.id, s.id, done, extras) || blocked.includes(s.id))
      return;
    const opened = descendants(persona.id, s.id, extras).filter(
      (id) => !done.includes(id),
    ).length;
    setDone((d) => [...d, s.id]);
    setMessage(
      t(
        `${s.title.en} done. ${opened} steps unlocked.`,
        `${s.title.ar} مكتملة. فُتحت ${opened} خطوات.`,
      ),
    );
    dialog.current?.close();
  };
  const loadChapter = (i: number) => {
    const c = timeline[i];
    setChapter(i);
    setDay(c.day);
    setDone(c.doneStepIds.filter((id) => plan.some((s) => s.id === id)));
    setBlocked(c.blockedStepIds.filter((id) => plan.some((s) => s.id === id)));
    setExtras([]);
    setMessage(c.caption[lang]);
  };
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      const i = Math.min(chapter + 1, timeline.length - 1);
      const snap = timeline[i];
      setDay(snap.day);
      setDone(
        snap.doneStepIds.filter((id) =>
          getSteps(persona.id).some((s) => s.id === id),
        ),
      );
      setBlocked(
        snap.blockedStepIds.filter((id) =>
          getSteps(persona.id).some((s) => s.id === id),
        ),
      );
      setMessage(snap.caption[ar ? "ar" : "en"]);
      if (i === timeline.length - 1) setPlaying(false);
      setChapter(i);
    }, 2400);
    return () => clearInterval(timer);
  }, [playing, persona.id, ar, chapter]);
  const reset = () => {
    setPlaying(false);
    setDone(initialDone.filter((id) => plan.some((s) => s.id === id)));
    setBlocked([]);
    setExtras([]);
    setDay(5);
    setChapter(3);
    setDocReviewed(false);
    setMessage(
      t("Sample plan reset to day 5.", "أعيدت الخطة إلى اليوم الخامس."),
    );
  };
  const applyBlocker = (eventId: string) => {
    const result = reroute(persona.id, done, blocked, extras, eventId);
    if (eventId === "bank-rejected" || eventId === "name-mismatch")
      setDraft(eventId === "name-mismatch" ? "name-correction" : "bank-follow-up");
    if (eventId === "lease-delayed") setDraft("lease-follow-up");
    setBlocked(result.blocked);
    setExtras(result.extras);
    setStuckOpen(false);
    setMessage(result.diff.summary[lang]);
    dialog.current?.close();
  };
  return (
    <main
      className={`workspace ${dark ? "night" : "marble"}`}
      dir={ar ? "rtl" : "ltr"}
      lang={ar ? "ar" : "en"}
    >
      <aside className="app-rail">
        <Link href="/" className="rail-brand" aria-label="Keystone home">
          <svg viewBox="0 0 24 26">
            <path
              d="M3 25V12a9 9 0 0 1 18 0v13h-5V12a4 4 0 0 0-8 0v13Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <Link
          className="rail-item active"
          href="/app"
          aria-label="Your journey"
        >
          <SquaresFour size={22} />
        </Link>
        <Link className="rail-item" href="/app/city" aria-label="City view">
          <Buildings size={22} />
        </Link>
        <div className="rail-bottom">
          <button className="rail-item" aria-label="Reset demo" onClick={reset}>
            <ArrowCounterClockwise size={21} />
          </button>
          <button
            className="rail-item"
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={21} /> : <Moon size={21} />}
          </button>
          <span className="avatar small">{persona.name.charAt(0)}</span>
        </div>
      </aside>
      <div className="app-body">
        <header className="app-header">
          <span className="breadcrumb">
            {t("Your new beginning", "بدايتك الجديدة")} <span>/</span> Abu Dhabi
          </span>
          <div>
            <span className="demo-pill">{t("Demo mode", "وضع تجريبي")}</span>
            <button className="language-button" onClick={() => setAr(!ar)}>
              <Globe size={15} />
              {ar ? "English" : "العربية"}
            </button>
          </div>
        </header>
        <div className="dashboard-content">
          <section className="dashboard-greeting">
            <div>
              <span className="eyebrow">
                {t("DAY", "اليوم")} {String(day).padStart(2, "0")} · ABU DHABI
              </span>
              <h1>
                {next
                  ? next.title[lang]
                  : t("The sample arch is standing.", "اكتمل القوس التجريبي.")}
              </h1>
              <p>
                {next
                  ? t(
                      "This is the one ready step that opens the most. Everything else can wait.",
                      "هذه هي الخطوة الجاهزة التي تفتح أكثر ما بعدها. الباقي يمكن أن ينتظر.",
                    )
                  : t(
                      "Every ready step in the sample plan is placed or paused.",
                      "كل خطوة جاهزة في الخطة التجريبية اكتملت أو توقفت.",
                    )}
              </p>
            </div>
            <div className="journey-progress">
              <Arch small progress={progress} />
              <div>
                <strong>{progress}%</strong>
                <span>
                  {done.length} / {plan.length}{" "}
                  {t("stones placed", "خطوات مكتملة")}
                </span>
              </div>
            </div>
          </section>
          <div className="dashboard-top">
            <section className="today-card">
              <div className="today-top">
                <span className="label">
                  <span className="gold-stone" />
                  {t("YOUR KEYSTONE TODAY", "خطوتك الأساسية اليوم")}
                </span>
                <span className="small-text">
                  {t("ONE STEP, MORE POSSIBILITIES", "خطوة واحدة، فرص أكثر")}
                </span>
              </div>
              {next ? (
                <>
                  <h2>
                    {t("Do this before the rest.", "افعل هذا قبل الباقي.")}
                  </h2>
                  <p>
                    {t(
                      "Mark the sample when it’s done. Nothing is sent to a bank, a landlord, or TAMM.",
                      "علّم العينة عند إنجازها. لا يُرسل شيء إلى بنك أو مالك أو تَم.",
                    )}
                  </p>
                  <div className="today-meta">
                    <span>
                      <Clock size={15} />
                      {next.typicalDays} {t("demo days", "أيام تجريبية")}
                    </span>
                    <span>
                      <ArrowUpRight size={15} />
                      {
                        descendants(persona.id, next.id, extras).filter(
                          (id) => !done.includes(id),
                        ).length
                      }{" "}
                      {t("steps downstream", "خطوات تالية")}
                    </span>
                  </div>
                  <div className="today-actions">
                    <button
                      className="button primary"
                      onClick={() => complete(next)}
                    >
                      {t("I did this", "أنجزت هذه الخطوة")}
                      <Check size={18} />
                    </button>
                    <button className="text-button" onClick={() => open(next)}>
                      {t("What it needs", "ماذا تحتاج")}
                      <ArrowRight size={15} />
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setStuckOpen(true)}
                    >
                      {t("Something went wrong", "حدث خطأ")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>
                    {remaining.length
                      ? t("Let’s clear the blockage.", "لنحل المشكلة.")
                      : t(
                          "You’re finding your place.",
                          "أصبحت أقرب إلى الاستقرار.",
                        )}
                  </h2>
                  <p>
                    {remaining.length
                      ? t(
                          "All ready steps are paused. Resume a blocked step in your map below.",
                          "كل الخطوات الجاهزة متوقفة. استأنف خطوة من الخريطة.",
                        )
                      : t(
                          "Every stone in your sample plan is in place. Welcome to your next chapter.",
                          "اكتملت كل خطوات خطتك التجريبية. أهلاً بفصلك القادم.",
                        )}
                  </p>
                  <button className="button primary" onClick={reset}>
                    {t("Explore again", "استكشف مجدداً")}
                    <ArrowCounterClockwise size={18} />
                  </button>
                </>
              )}
            </section>
            <aside className="deadline-card">
              <div className="panel-heading">
                <h3>{t("On the horizon", "في الأفق")}</h3>
                <Clock size={18} />
              </div>
              <p className="small-text">
                {t(
                  "A little preparation goes a long way.",
                  "الاستعداد المبكر يصنع فرقاً.",
                )}
              </p>
              {deadlines
                .filter((d) => d.personaId === persona.id)
                .map((d) => (
                  <div className="deadline" key={d.id}>
                    <span className={d.dueDay - day <= 3 ? "due" : "neutral"}>
                      {d.dueDay - day >= 0
                        ? `${d.dueDay - day}d`
                        : t("Past", "مضى")}
                    </span>
                    <div>
                      <strong>
                        {ar
                          ? d.kind === "booking"
                            ? "نهاية الحجز التجريبي"
                            : d.kind === "employer"
                              ? "موعد الراتب التجريبي"
                              : "نهاية العرض المدرسي التجريبي"
                          : d.label.replace("Sample ", "")}
                      </strong>
                      <small>
                        {t(
                          "Fictional booking / provider date",
                          "موعد حجز أو مزود تجريبي",
                        )}
                      </small>
                    </div>
                  </div>
                ))}
              <span className="assumption">
                {t(
                  "Sample reminders, not statutory deadlines.",
                  "تذكيرات تجريبية، وليست مواعيد قانونية.",
                )}
              </span>
            </aside>
          </div>
          {next?.id === "bank_account" ? <BankAgent /> : null}
          <section className="unlock-section">
            <div className="section-title">
              <div>
                <span className="eyebrow">
                  {t("THE BIGGER PICTURE", "الصورة الكاملة")}
                </span>
                <h2>{t("Your unlock map", "خريطة خطواتك")}</h2>
              </div>
              <div className="map-legend">
                <span>
                  <Check size={12} />
                  {t("Done", "مكتمل")}
                </span>
                <span>
                  <span className="outline-dot" />
                  {t("Ready", "جاهز")}
                </span>
                <span>
                  <LockSimple size={12} />
                  {t("Waiting", "بانتظار")}
                </span>
              </div>
            </div>
            <div className="unlock-map">
              {lanes
                .filter((l) => plan.some((s) => s.lane === l.id))
                .map((l) => (
                  <div className="map-lane" key={l.id}>
                    <div className="lane-heading">
                      <l.icon size={19} />
                      <h3>{l[lang]}</h3>
                      <span>
                        {
                          plan.filter(
                            (s) => s.lane === l.id && done.includes(s.id),
                          ).length
                        }
                        /{plan.filter((s) => s.lane === l.id).length}
                      </span>
                    </div>
                    <div className="lane-stones">
                      {plan
                        .filter((s) => s.lane === l.id)
                        .map((s) => {
                          const status = done.includes(s.id)
                            ? "done"
                            : blocked.includes(s.id)
                              ? "blocked"
                              : s.id === next?.id
                                ? "keystone"
                                : isAvailable(persona.id, s.id, done, extras)
                                  ? "ready"
                                  : "locked";
                          return (
                            <button
                              key={s.id}
                              className={`map-step ${status}`}
                              onClick={() => open(s)}
                            >
                              <span className="stone-status">
                                {status === "done" ? (
                                  <Check size={13} weight="bold" />
                                ) : status === "locked" ? (
                                  <LockSimple size={12} />
                                ) : status === "blocked" ? (
                                  <WarningCircle size={14} />
                                ) : status === "keystone" ? (
                                  <ArrowUpRight size={14} />
                                ) : (
                                  <span />
                                )}
                              </span>
                              <span>{s.title[lang]}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
            <div className="map-foot">
              <span>
                {t(
                  "Click any stone to see what it needs and what it opens.",
                  "اختر أي خطوة لمعرفة متطلباتها وما تفتحه.",
                )}
              </span>
              <span>
                {t("Illustrative dependency rules", "قواعد اعتماد تجريبية")}
              </span>
            </div>
          </section>
          <div className="dashboard-bottom">
            <section className="housing-card">
              <div className="panel-heading">
                <h3>{t("A home, within reach", "منزل في متناولك")}</h3>
                <House size={19} />
              </div>
              <p>
                {t(
                  "Compare the cash you need before you sign.",
                  "قارن المبلغ الذي تحتاجه قبل التوقيع.",
                )}
              </p>
              <div className="cheque-control">
                <span>{t("Rent cheques", "شيكات الإيجار")}</span>
                <div>
                  {[1, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCheques(n)}
                      aria-pressed={cheques === n}
                      className={cheques === n ? "active" : ""}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="cash-total">
                <span>{t("UPFRONT CASH · AED", "المبلغ الأولي · درهم")}</span>
                <strong>{money(quote.upfrontCash)}</strong>
              </div>
              <dl className="cost-breakdown">
                <div>
                  <dt>{t("First rent payment", "أول دفعة إيجار")}</dt>
                  <dd>{money(quote.firstPayment)}</dd>
                </div>
                <div>
                  <dt>{t("Deposit + agent fee", "التأمين + رسوم الوسيط")}</dt>
                  <dd>{money(quote.deposit + quote.agentFee)}</dd>
                </div>
                <div>
                  <dt>
                    {t("Utility deposit + moving", "تأمين الخدمات + الانتقال")}
                  </dt>
                  <dd>{money(quote.utilityDeposit + quote.movingCost)}</dd>
                </div>
              </dl>
              <div className="budget-line">
                {t("Sample available cash", "السيولة التجريبية")}: AED{" "}
                {money(persona.openingCash)}
                <strong
                  className={
                    quote.upfrontCash > persona.openingCash
                      ? "over-budget"
                      : "within-budget"
                  }
                >
                  {quote.upfrontCash > persona.openingCash
                    ? t("Over budget", "يتجاوز الميزانية")
                    : t("Within budget", "ضمن الميزانية")}
                </strong>
              </div>
              <small className="assumption">
                {t(
                  "Fictional quotes and fees. Not market prices.",
                  "عروض ورسوم خيالية، وليست أسعار السوق.",
                )}
              </small>
            </section>
            <section className="document-card">
              <div className="panel-heading">
                <h3>{t("The details matter", "التفاصيل مهمة")}</h3>
                <FileText size={19} />
              </div>
              {persona.id === "priya" ? (
                <>
                  <div className="review-banner">
                    <WarningCircle size={19} />
                    <span>
                      {docReviewed
                        ? t(
                            "Reviewed — confirm with HR",
                            "تمت المراجعة — أكد مع الموارد البشرية",
                          )
                        : t("One name. Two versions.", "اسم واحد، نسختان.")}
                    </span>
                  </div>
                  <div className="name-comparison">
                    <div>
                      <span>{t("SAMPLE PASSPORT", "جواز تجريبي")}</span>
                      <strong>Priya Ramesh Nair</strong>
                    </div>
                    <div>
                      <span>{t("SAMPLE OFFER LETTER", "عرض تجريبي")}</span>
                      <strong>Priya R. Nair</strong>
                    </div>
                  </div>
                  <p>
                    {t(
                      "The offer uses an abbreviation. Ask the receiving institution whether an updated letter is needed.",
                      "يستخدم العرض اسماً مختصراً. اسأل الجهة المستلمة إن كانت تحتاج خطاباً محدثاً.",
                    )}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setDocReviewed(!docReviewed);
                      setDraft("name-correction");
                      setMessage(
                        t(
                          "Review status updated. The HR draft below is ready.",
                          "تم تحديث حالة المراجعة. مسودة الموارد البشرية جاهزة.",
                        ),
                      );
                    }}
                  >
                    <Check size={16} />
                    {docReviewed
                      ? t("Reopen review", "إعادة المراجعة")
                      : t("Mark as reviewed", "تمت المراجعة")}
                  </button>
                </>
              ) : (
                <>
                  <div className="review-banner clear">
                    <Check size={19} />
                    {t("Sample names match", "الأسماء التجريبية متطابقة")}
                  </div>
                  <p>
                    {t(
                      "No name discrepancy in this sample set. The receiving institution still verifies the originals.",
                      "لا يوجد اختلاف في أسماء هذه العينات. تتحقق الجهة المستلمة من الأصول.",
                    )}
                  </p>
                </>
              )}
              <span className="assumption">
                {t(
                  "Sample comparison · human review required",
                  "مقارنة تجريبية · تتطلب مراجعة بشرية",
                )}
              </span>
            </section>
          </div>
          <section className="message-card">
            <div>
              <span className="eyebrow">
                {t("SAY IT WITH CONFIDENCE", "قلها بثقة")}
              </span>
              <h3>
                {t("The words for your next step.", "الكلمات لخطوتك القادمة.")}
              </h3>
              <label htmlFor="draft">
                {t("Choose a sample message", "اختر رسالة تجريبية")}
              </label>
              <select
                id="draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              >
                {messageTemplates.filter(m => persona.id === 'priya' || m.id !== 'name-correction').map((m) => (
                  <option key={m.id} value={m.id}>
                    {ar
                      ? m.recipient === "HR"
                        ? "الموارد البشرية"
                        : m.recipient === "bank"
                          ? "البنك"
                          : m.recipient === "school"
                            ? "المدرسة"
                            : "المالك"
                      : `To ${m.recipient}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="draft-text">{template[lang]}</p>
              <button
                className="text-button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(template[lang]);
                    setMessage(
                      t(
                        "Draft copied. Review it before sending.",
                        "نُسخت المسودة. راجعها قبل الإرسال.",
                      ),
                    );
                  } catch {
                    setMessage(
                      t(
                        "Select the draft text to copy it.",
                        "حدد نص المسودة لنسخه.",
                      ),
                    );
                  }
                }}
              >
                <Copy size={16} />
                {t("Copy draft", "نسخ المسودة")}
              </button>
            </div>
          </section>
          {persona.id === "priya" && (
            <section className="replay">
              <div>
                <span className="eyebrow">
                  {t("A MONTH, IN MOMENTS", "شهر في لحظات")}
                </span>
                <strong>
                  {t(
                    "Replay Priya’s sample journey",
                    "استعرض رحلة بريا التجريبية",
                  )}
                </strong>
              </div>
              <button
                className="icon-button"
                aria-label={playing ? "Pause replay" : "Play replay"}
                onClick={() => {
                  if (chapter === timeline.length - 1) loadChapter(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <input
                aria-label="Sample journey chapter"
                type="range"
                min="0"
                max={timeline.length - 1}
                value={chapter}
                onChange={(e) => {
                  setPlaying(false);
                  loadChapter(Number(e.target.value));
                }}
              />
              <span className="small-text">
                {t("Day", "اليوم")} {day} / 30
              </span>
              <button className="text-button" onClick={reset}>
                {t("Reset", "إعادة ضبط")}
              </button>
            </section>
          )}
          <footer className="app-footer">
            <span>{t("Your life, coming together.", "حياتك تتكامل.")}</span>
            <span>
              {t(
                "Fictional demo · verify requirements with the relevant provider.",
                "عرض خيالي · تحقق من المتطلبات مع المزود المعني.",
              )}
            </span>
          </footer>
        </div>
      </div>
      <div className="toast" role="status" aria-live="polite" key={message}>
        {message && (
          <>
            <Check size={16} />
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>
      {stuckOpen && (
        <div className="stuck-layer" role="presentation" onClick={() => setStuckOpen(false)}>
          <div
            className="stuck-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stuck-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="stuck-title">{t("What went wrong?", "ما الذي حدث؟")}</h2>
            <p>
              {t(
                "Pick the stall. The sample plan will pause that step and show the next thing you can still do.",
                "اختر العائق. ستوقف الخطة التجريبية تلك الخطوة وتظهر ما يزال بإمكانك فعله.",
              )}
            </p>
            {blockers.map((item) => (
              <button key={item.id} type="button" onClick={() => applyBlocker(item.id)}>
                {item.id === "bank-rejected"
                  ? t("The bank asked for more", "طلب البنك المزيد")
                  : item.id === "lease-delayed"
                    ? t("The landlord delayed the lease", "تأخر المالك في العقد")
                    : item.id === "medical-rescheduled"
                      ? t("The medical test moved", "تأجل الفحص الطبي")
                      : t("The names don’t match", "الأسماء غير متطابقة")}
              </button>
            ))}
            <button type="button" className="text-button" onClick={() => setStuckOpen(false)}>
              {t("Cancel", "إلغاء")}
            </button>
          </div>
        </div>
      )}
      <dialog
        ref={dialog}
        className="step-dialog"
        aria-labelledby="step-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div>
            <div className="dialog-top">
              <span className="eyebrow">
                {t("YOUR STEP, EXPLAINED", "شرح خطوتك")}
              </span>
              <button
                className="icon-button"
                aria-label="Close step"
                onClick={() => dialog.current?.close()}
              >
                <X size={22} />
              </button>
            </div>
            <h2 id="step-title">{selected.title[lang]}</h2>
            <span className="demo-pill">
              {t("Demo walkthrough", "شرح تجريبي")}
            </span>
            <p>{selected.where}</p>
            <div className="step-checklist">
              <h3>{t('Your walkthrough', 'خطوات التنفيذ')}</h3>
              <ol className="walkthrough-list">
                <li>{t('Check the prerequisite stones below. Finish any that are still waiting.', 'راجع الخطوات المطلوبة أدناه وأكمل ما ينتظر منها.')}</li>
                <li>{t('Gather the documents and confirm the current requirements with the receiving provider.', 'جهز المستندات وأكد المتطلبات الحالية مع الجهة المستلمة.')}</li>
                <li>{t('Keep the provider’s confirmation. Then mark the sample stone complete to explore what opens next.', 'احتفظ بتأكيد الجهة ثم أكمل الخطوة التجريبية لاستكشاف الخطوات التالية.')}</li>
              </ol>
              <h3>{t("Before you begin", "قبل أن تبدأ")}</h3>
              {dependencies(persona.id, selected.id).length ? (
                dependencies(persona.id, selected.id).map((id) => (
                  <div key={id}>
                    {done.includes(id) ? (
                      <Check size={18} />
                    ) : (
                      <LockSimple size={18} />
                    )}
                    <span>{steps.find((s) => s.id === id)?.title[lang]}</span>
                  </div>
                ))
              ) : (
                <p>
                  {t(
                    "No prior steps in this sample plan.",
                    "لا توجد خطوات سابقة في هذه الخطة.",
                  )}
                </p>
              )}
              <h3>{t("Have these ready", "جهز هذه المستندات")}</h3>
              {selected.docsNeeded.length ? (
                selected.docsNeeded.map((d) => (
                  <div key={d}>
                    <FileText size={18} />
                    <span>{d.replaceAll("_", " ")}</span>
                  </div>
                ))
              ) : (
                <p>
                  {t(
                    "Confirm the document list with the receiving provider.",
                    "أكد قائمة المستندات مع المزود المستلم.",
                  )}
                </p>
              )}
              <h3>{t("What this opens", "ما تفتحه هذه الخطوة")}</h3>
              <p>
                {descendants(persona.id, selected.id, extras).length}{" "}
                {t(
                  "downstream steps in your sample journey.",
                  "خطوات لاحقة في رحلتك التجريبية.",
                )}
              </p>
            </div>
            <p className="assumption">
              {t(
                "This marks a sample task complete. It does not submit an application or confirm approval.",
                "يُكمل هذا مهمة تجريبية فقط، ولا يقدم طلباً أو يؤكد الموافقة.",
              )}
            </p>
            <div className="button-row">
              {blocked.includes(selected.id) ? (
                <button
                  className="button primary"
                  onClick={() => {
                    setBlocked((b) => b.filter((id) => id !== selected.id));
                    dialog.current?.close();
                    setMessage(
                      t(
                        "Step resumed. The plan has been recalculated.",
                        "استؤنفت الخطوة وأعيد حساب الخطة.",
                      ),
                    );
                  }}
                >
                  {t("Resume this step", "استئناف الخطوة")}
                </button>
              ) : done.includes(selected.id) ? (
                <span className="completed-label">
                  <Check />
                  {t("Stone already placed", "اكتملت الخطوة")}
                </span>
              ) : (
                <button
                  className="button primary"
                  disabled={!isAvailable(persona.id, selected.id, done, extras)}
                  onClick={() => complete(selected)}
                >
                  {t("Mark sample step complete", "إكمال الخطوة التجريبية")}
                  <Check size={18} />
                </button>
              )}
              {!done.includes(selected.id) &&
                !blocked.includes(selected.id) &&
                isAvailable(persona.id, selected.id, done, extras) && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setStuckOpen(true);
                      dialog.current?.close();
                    }}
                  >
                    {t("I’m stuck", "أنا عالق")}
                  </button>
                )}
            </div>
            {blocked.includes(selected.id) && (
              <p>
                {t(
                  "Ask the provider which evidence is missing. You can copy a follow-up draft in the workspace while other ready tasks continue.",
                  "اسأل المزود عن الأدلة الناقصة. يمكنك نسخ مسودة متابعة ومواصلة المهام الجاهزة.",
                )}
              </p>
            )}
          </div>
        )}
      </dialog>
    </main>
  );
}
