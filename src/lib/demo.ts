import { mockExtractions, personas, steps, type Step } from "@/data";

export function explainStep(step: Step) {
  const docs = step.docsNeeded.length
    ? step.docsNeeded.map((d) => d.replaceAll("_", " ")).join(", ")
    : "the papers the provider asks for";
  return {
    en: `${step.title.en} usually comes after the steps it depends on. Have ${docs} ready, then confirm the current requirement with ${step.where}.`,
    ar: `${step.title.ar} تأتي عادة بعد الخطوات التي تعتمد عليها. جهّز المطلوب، ثم أكد الشرط الحالي مع الجهة المذكورة.`,
  };
}

export function sampleFacts(personaId: string) {
  const extracted = mockExtractions.find((m) => m.personaId === personaId);
  const person = personas.find((p) => p.id === personaId) ?? personas[0];
  if (extracted) {
    return {
      names: extracted.names,
      nationality: extracted.nationality,
      sponsor: extracted.sponsor,
      employer: extracted.employer,
      arrivalDate: extracted.arrivalDate,
      family: extracted.family.map((f) => f.name),
    };
  }
  return {
    names: [person.name],
    nationality: person.nationality,
    sponsor: person.sponsor,
    employer: person.employer,
    arrivalDate: "2026-10-05",
    family: person.family.map((f) => f.name),
  };
}

export function tokenDiffers(token: string, variants: string[]) {
  const norm = (value: string) =>
    value.replace(/[^A-Za-z\u0600-\u06FF]/g, "").toUpperCase();
  const current = norm(token);
  if (current.length < 2) return false;
  return variants.some(
    (variant) =>
      !variant.split(/\s+/).some((part) => {
        const next = norm(part);
        return (
          next === current || next.startsWith(current) || current.startsWith(next)
        );
      }),
  );
}

export const voiceScript = [
  {
    en: "Priya, your bank account is the step that opens the most.",
    ar: "بريا، حسابك البنكي هو الخطوة التي تفتح أكثر ما بعدها.",
  },
  {
    en: "The offer letter shortens your middle name. A person should confirm that before the bank does.",
    ar: "خطاب العرض يختصر اسمك الأوسط. من الأفضل أن يؤكده شخص قبل البنك.",
  },
  {
    en: "If the lease slips, extend the temporary stay and keep the other ready steps moving.",
    ar: "إذا تأخر العقد، مددي السكن المؤقت وواصلي الخطوات الجاهزة الأخرى.",
  },
  {
    en: "This is a sample conversation. Nothing was sent to a model.",
    ar: "هذه محادثة تجريبية. لم يُرسل شيء إلى أي نموذج.",
  },
];

export function stepById(id: string) {
  return steps.find((s) => s.id === id);
}
