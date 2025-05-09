import { describe, it, expect, afterAll } from "vitest";
import {
  GetPointMultiplier,
  GetPointTable,
  UpdatePointTable,
} from "./point-service";
import { PointTableDTO } from "../models/dtos/point-table-dto";
import { PointMultiplier } from "../models/point-multiplier";

describe("Point Service Test", () => {
  afterAll(async () => {
    PointMultiplier.deleteMany();
  });

  it("PointTable Create", async () => {
    const newPointTable: PointTableDTO = {};
    newPointTable.pointMultipliers = [
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
    await UpdatePointTable(newPointTable);
  });

  it("PointTable Get", async () => {
    const pointMultiplier = await GetPointTable();
    expect(pointMultiplier!.pointMultipliers!.length).toBe(6);
  });

  it("PointTable GetPointMultiplier", async () => {
    expect(await GetPointMultiplier(6)).toBe(1 / 6);
  });
});
