import { plans, steps } from "@/data";
export function getPlan(personaId: string) {
  return plans.find((p) => p.personaId === personaId) ?? plans[0];
}
export function getSteps(personaId: string) {
  const plan = getPlan(personaId);
  return steps.filter((s) => plan.stepIds.includes(s.id));
}
export function dependencies(personaId: string, id: string): string[] {
  return (
    (getPlan(personaId).dependencies as Record<string, string[] | undefined>)[
      id
    ] ?? []
  );
}
export function isAvailable(personaId: string, id: string, done: string[]) {
  return (
    !done.includes(id) &&
    dependencies(personaId, id).every((d) => done.includes(d))
  );
}
export function descendants(personaId: string, id: string): string[] {
  const found = new Set<string>();
  const visit = (parent: string) => {
    for (const s of getSteps(personaId))
      if (dependencies(personaId, s.id).includes(parent) && !found.has(s.id)) {
        found.add(s.id);
        visit(s.id);
      }
  };
  visit(id);
  return [...found];
}
export function nextStep(
  personaId: string,
  done: string[],
  blocked: string[] = [],
) {
  return getSteps(personaId)
    .filter(
      (s) => isAvailable(personaId, s.id, done) && !blocked.includes(s.id),
    )
    .sort(
      (a, b) =>
        descendants(personaId, b.id).filter((id) => !done.includes(id)).length -
        descendants(personaId, a.id).filter((id) => !done.includes(id)).length,
    )[0];
}
