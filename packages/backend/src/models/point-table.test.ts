import { describe, it, expect, afterAll } from "vitest";
import { PointTable } from "./point-table";
import { PointMultiplier } from "./point-multiplier";

describe("Point Table Test", () => {
  afterAll(async () => {
    await PointTable.deleteMany();
  });

  it("PointTable Create", async () => {
    const pointTable = new PointTable();
    pointTable.pointMultipliers = [
      new PointMultiplier({ peopleCountCondition: "1", multiplier: "1" }),
      new PointMultiplier({ peopleCountCondition: "2", multiplier: "0.8" }),
      new PointMultiplier({ peopleCountCondition: "3", multiplier: "0.6" }),
      new PointMultiplier({ peopleCountCondition: "4", multiplier: "0.5" }),
      new PointMultiplier({
        peopleCountCondition: "5-9",
        multiplier: "1/people",
      }),
      new PointMultiplier({ peopleCountCondition: "+10", multiplier: "0.1" }),
    ];
    const savedPointTable = await pointTable.save();

    expect(savedPointTable.pointMultipliers).toBeDefined();
    expect(savedPointTable.pointMultipliers.length).toBe(6);
    expect(savedPointTable.pointMultipliers[3].peopleCountCondition).toBe("4");
  });

  it("PointTable FindOne", async () => {
    const pointTable = await PointTable.findOne();
    expect(pointTable).toBeDefined();
    expect(pointTable?.pointMultipliers[4].peopleCountCondition).toBe("5-9");
    expect(PointTable.GetPointMultiplier(pointTable!.pointMultipliers,4)).toBe(0.5);
    expect(PointTable.GetPointMultiplier(pointTable!.pointMultipliers,5)).toBe(1 / 5);
  });
});
