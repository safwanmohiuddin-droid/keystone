import { blockers, deadlines, plans, steps, type StepStatus } from "@/data";

export function getPlan(personaId: string) {
  return plans.find((p) => p.personaId === personaId) ?? plans[0];
}

export function planFor(personaId: string) {
  return getPlan(personaId);
}

export function getSteps(personaId: string, extras: string[] = []) {
  const ids = new Set([...getPlan(personaId).stepIds, ...extras]);
  return steps.filter((s) => ids.has(s.id));
}

export function dependencies(personaId: string, id: string): string[] {
  const fromPlan = (
    getPlan(personaId).dependencies as Record<string, string[] | undefined>
  )[id];
  if (fromPlan) return fromPlan;
  return steps.find((s) => s.id === id)?.dependsOn ?? [];
}

export function isAvailable(
  personaId: string,
  id: string,
  done: string[],
  extras: string[] = [],
) {
  return (
    getSteps(personaId, extras).some((s) => s.id === id) &&
    !done.includes(id) &&
    dependencies(personaId, id).every((d) => done.includes(d))
  );
}

export function descendants(
  personaId: string,
  id: string,
  extras: string[] = [],
): string[] {
  const found = new Set<string>();
  const visit = (parent: string) => {
    for (const s of getSteps(personaId, extras))
      if (dependencies(personaId, s.id).includes(parent) && !found.has(s.id)) {
        found.add(s.id);
        visit(s.id);
      }
  };
  visit(id);
  return [...found];
}

function openCount(
  personaId: string,
  id: string,
  done: string[],
  extras: string[],
) {
  return descendants(personaId, id, extras).filter((d) => !done.includes(d))
    .length;
}

function deadlineRank(personaId: string, id: string) {
  const hit = deadlines.find(
    (d) => d.personaId === personaId && d.stepId === id,
  );
  return hit?.bookByDay ?? hit?.dueDay ?? 999;
}

export function pickKeystone(
  personaId: string,
  done: string[],
  blocked: string[] = [],
  extras: string[] = [],
) {
  return getSteps(personaId, extras)
    .filter(
      (s) =>
        isAvailable(personaId, s.id, done, extras) && !blocked.includes(s.id),
    )
    .sort((a, b) => {
      const leverage =
        openCount(personaId, b.id, done, extras) -
        openCount(personaId, a.id, done, extras);
      if (leverage !== 0) return leverage;
      return deadlineRank(personaId, a.id) - deadlineRank(personaId, b.id);
    })[0];
}

export function nextStep(
  personaId: string,
  done: string[],
  blocked: string[] = [],
  extras: string[] = [],
) {
  return pickKeystone(personaId, done, blocked, extras);
}

export function statuses(
  personaId: string,
  done: string[],
  blocked: string[] = [],
  extras: string[] = [],
): Record<string, StepStatus> {
  const key = pickKeystone(personaId, done, blocked, extras)?.id;
  const out: Record<string, StepStatus> = {};
  for (const s of getSteps(personaId, extras)) {
    out[s.id] = done.includes(s.id)
      ? "done"
      : blocked.includes(s.id)
        ? "blocked"
        : s.id === key
          ? "keystone"
          : isAvailable(personaId, s.id, done, extras)
            ? "available"
            : "locked";
  }
  return out;
}

export function criticalPath(personaId: string, extras: string[] = []) {
  const list = getSteps(personaId, extras);
  const memo = new Map<string, { days: number; path: string[] }>();
  const walk = (id: string): { days: number; path: string[] } => {
    const cached = memo.get(id);
    if (cached) return cached;
    const days = list.find((s) => s.id === id)?.typicalDays ?? 0;
    const children = list.filter((s) =>
      dependencies(personaId, s.id).includes(id),
    );
    let best = { days: 0, path: [] as string[] };
    for (const child of children) {
      const next = walk(child.id);
      if (next.days > best.days) best = next;
    }
    const value = { days: days + best.days, path: [id, ...best.path] };
    memo.set(id, value);
    return value;
  };
  let best = { days: -1, path: [] as string[] };
  for (const root of list.filter(
    (s) => dependencies(personaId, s.id).length === 0,
  )) {
    const next = walk(root.id);
    if (next.days > best.days) best = next;
  }
  return best.path;
}

export function reroute(
  personaId: string,
  done: string[],
  blocked: string[],
  extras: string[],
  eventId: string,
) {
  const event = blockers.find((b) => b.id === eventId);
  if (!event) {
    return {
      blocked,
      extras,
      diff: {
        added: [] as string[],
        blocked: [] as string[],
        keystoneId: pickKeystone(personaId, done, blocked, extras)?.id,
        summary: {
          en: "That pause is not in the sample set.",
          ar: "هذا التوقف غير موجود في العينة.",
        },
      },
    };
  }
  const nextBlocked = blocked.includes(event.stepId)
    ? blocked
    : [...blocked, event.stepId];
  const recovery = event.recoveryStepId;
  const known = getPlan(personaId).stepIds.includes(recovery ?? "");
  const nextExtras =
    recovery && !known && !extras.includes(recovery)
      ? [...extras, recovery]
      : extras;
  const keystone = pickKeystone(personaId, done, nextBlocked, nextExtras);
  const added = nextExtras.filter((id) => !extras.includes(id));
  const title = keystone?.title.en ?? "a later step";
  const titleAr = keystone?.title.ar ?? "خطوة لاحقة";
  return {
    blocked: nextBlocked,
    extras: nextExtras,
    diff: {
      added,
      blocked: nextBlocked.filter((id) => !blocked.includes(id)),
      keystoneId: keystone?.id,
      summary: {
        en: added.length
          ? `+${added.length} step · new keystone: ${title}`
          : `Step paused · next: ${title}`,
        ar: added.length
          ? `+${added.length} خطوة · الخطوة التالية: ${titleAr}`
          : `توقفت الخطوة · التالية: ${titleAr}`,
      },
    },
  };
}

export function toArchStones(personaId: string, extras: string[] = []) {
  const list = getSteps(personaId, extras);
  const groups = Math.min(15, Math.max(9, Math.min(12, list.length || 9)));
  const size = Math.ceil(list.length / groups) || 1;
  const stones: { id: string; stepIds: string[] }[] = [];
  for (let i = 0; i < list.length; i += size) {
    const stepIds = list.slice(i, i + size).map((s) => s.id);
    stones.push({ id: `stone-${stones.length + 1}`, stepIds });
  }
  return stones.slice(0, 15);
}
