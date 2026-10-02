import { describe, it, expect } from "vitest";
import { getSteps, isAvailable, nextStep, descendants } from "./graph";
describe("sample unlock order", () => {
  it("keeps banking locked until both identity and SIM are complete", () => {
    expect(isAvailable("priya", "bank_account", ["eid_card"])).toBe(false);
    expect(
      isAvailable("priya", "bank_account", ["eid_card", "local_sim"]),
    ).toBe(true);
  });
  it("does not recommend a blocked step and finds a parallel ready action", () => {
    const done = [
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
    expect(nextStep("priya", done)?.id).toBe("bank_account");
    expect(nextStep("priya", done, ["bank_account"])?.id).not.toBe(
      "bank_account",
    );
    expect(nextStep("priya", done, ["bank_account"])).toBeDefined();
  });
  it("adapts family and licence paths to each sample person", () => {
    expect(
      getSteps("omar").some((s) => s.lane === "family" || s.lane === "car"),
    ).toBe(false);
    expect(getSteps("priya").some((s) => s.id === "driving_training")).toBe(
      true,
    );
    expect(getSteps("lena").some((s) => s.id === "licence_conversion")).toBe(
      true,
    );
    expect(getSteps("lena").some((s) => s.id === "driving_training")).toBe(
      false,
    );
  });
  it("counts descendants once and excludes the current step", () => {
    const ids = descendants("priya", "bank_account");
    expect(ids).toContain("lease_and_cheques");
    expect(ids).toContain("school_enrollment");
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain("bank_account");
  });
  it("can complete every eligible plan through dependency-respecting recommendations", () => {
    for (const p of ["priya", "omar", "lena"]) {
      const done: string[] = [];
      for (let i = 0; i < 40; i++) {
        const next = nextStep(p, done);
        if (!next) break;
        expect(isAvailable(p, next.id, done)).toBe(true);
        done.push(next.id);
      }
      expect(done.length).toBe(getSteps(p).length);
      expect(nextStep(p, done)).toBeUndefined();
    }
  });
});
