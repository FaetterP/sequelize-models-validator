import { Model, ModelCtor } from "sequelize";
import { checkColumns } from "./columns";
import { checkParanoid } from "./paranoid";
import { checkTimestamps } from "./timestamps";
import { checkUnderscore } from "./underscore";
import { checkServiceTables } from "./serviceTables";

const checkers: ((
  model: ModelCtor<Model<any, any>>
) => void | Promise<void>)[] = [
  checkTimestamps,
  checkParanoid,
  checkUnderscore,
  checkColumns,
  checkServiceTables,
];

export async function checkAll(model: ModelCtor<Model<any, any>>) {
  for (const checker of checkers) {
    await checker(model);
  }
}
