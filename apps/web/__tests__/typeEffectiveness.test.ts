import { describe, it, expect } from "vitest";
import { formatEffectiveness } from "@/components/pokemon/TypeEffectivenessChart";

describe("formatEffectiveness", () => {
  it("returns '4×' for quadruple weakness", () => {
    expect(formatEffectiveness(4)).toBe("4×");
  });
  it("returns '2×' for double weakness", () => {
    expect(formatEffectiveness(2)).toBe("2×");
  });
  it("returns '½×' for resistance", () => {
    expect(formatEffectiveness(0.5)).toBe("½×");
  });
  it("returns '¼×' for double resistance", () => {
    expect(formatEffectiveness(0.25)).toBe("¼×");
  });
  it("returns '0×' for immunity", () => {
    expect(formatEffectiveness(0)).toBe("0×");
  });
  it("returns '1×' for neutral", () => {
    expect(formatEffectiveness(1)).toBe("1×");
  });
});
