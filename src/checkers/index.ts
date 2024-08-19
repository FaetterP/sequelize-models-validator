import { Model, ModelCtor, Sequelize } from "sequelize";
import { checkColumns } from "./columns";
import { checkParanoid } from "./paranoid";
import { checkTimestamps } from "./timestamps";
import { checkUnderscore } from "./underscore";
import { checkServiceTables } from "./serviceTables";
import { checkDataTypes } from "./dataType";
import { Problem } from "../types";

const checkers: ((
  model: ModelCtor<Model<any, any>>,
  sequelize: Sequelize,
) => Problem[] | Promise<Problem[]>)[] = [
  checkTimestamps,
  checkParanoid,
  checkUnderscore,
  checkColumns,
  checkServiceTables,
  checkDataTypes,
];

export async function checkAll(
  model: ModelCtor<Model<any, any>>,
  sequelize: Sequelize,
): Promise<Problem[]> {
  const modelProblems: Problem[] = [];

  for (const checker of checkers) {
    const checkerProblem = await checker(model, sequelize);
    modelProblems.push(...checkerProblem);
  }

  return modelProblems;
}
