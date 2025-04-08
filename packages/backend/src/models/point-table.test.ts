import { describe, it, expect } from 'vitest';
import { PointTable } from './point-table';
import { PointMultiplier } from './point-multiplier';

describe('PointTable Test', () => {
    it('PointTable Create', async () => {
        const pointTable = new PointTable();
        pointTable.pointMultipliers = [
            new PointMultiplier("1", "1"),
            new PointMultiplier("2", "0.8"),
            new PointMultiplier("3", "0.6"),
            new PointMultiplier("4", "0.5"),
            new PointMultiplier("5-9", "1/people"),
            new PointMultiplier("+10", "0.1"),
        ]
        const savedPointTable = await pointTable.save();


        expect(savedPointTable.pointMultipliers != null).toBe(true);
        expect(savedPointTable.pointMultipliers.length).toBe(6);
        expect(savedPointTable.pointMultipliers[3].peopleCountCondition == "4").toBe(true);
    });

    it('PointTable GetPointTable', async () => {
        const pointTable = await PointTable.findOne();
        expect(pointTable?.pointMultipliers[4].peopleCountCondition == "5-9").toBe(true);
        expect(pointTable?.GetPointMultiplier(4)).toBe(0.5);
        expect(pointTable?.GetPointMultiplier(5)).toBe(1/5);
    });
});