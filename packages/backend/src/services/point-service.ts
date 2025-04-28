import { PointTableDTO } from "../models/dtos/point-table-dto";
import { PointTable } from "../models/point-table";

export async function UpdatePointTable(pointTableDTO: PointTableDTO) {
  let pointTable = await PointTable.findOne({});

  if (pointTable == null) pointTable = new PointTable();

  pointTable.$set(pointTableDTO);
  await pointTable.save();
}

export async function GetPointTable(): Promise<PointTableDTO | null> {
  const pointTable = await PointTable.findOne({});

  if (pointTable == null) throw new Error("PointTable Not Found");

  return pointTable;
}

export async function GetPointMultiplier(PeopleCount: number): Promise<number> {
  const pointTable = await PointTable.findOne({});

  if (pointTable == null) throw new Error("PointTable Not Found");

  return PointTable.GetPointMultiplier(pointTable.pointMultipliers,PeopleCount);
}
