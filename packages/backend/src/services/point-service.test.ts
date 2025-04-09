import { describe, it, expect } from "vitest";
import {
  GetPointMultiplier,
  GetPointTable,
  UpdatePointTable,
} from "./point-service";
import { PointTableDTO } from "../models/dtos/point-table-dto";
import { PointMultiplier } from "../models/point-multiplier";

describe("Point Service Test", () => {
  it("PointTable Create", async () => {
    const newPointTable: PointTableDTO = {};
    newPointTable.pointMultipliers = [
      new PointMultiplier("1", "1"),
      new PointMultiplier("2", "0.8"),
      new PointMultiplier("3", "0.6"),
      new PointMultiplier("4", "0.5"),
      new PointMultiplier("5-9", "1/people"),
      new PointMultiplier("10", "1"),
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
