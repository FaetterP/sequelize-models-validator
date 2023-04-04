import { Model, ModelCtor } from "sequelize";
import { checkColumns } from "./columns";
import { checkParanoid } from "./paranoid";
import { checkTimestamps } from "./timestamps";
import { checkUnderscore } from "./underscore";
import colors from "colors"

const checkers: ((
  model: ModelCtor<Model<any, any>>
) => void | Promise<void>)[] = [
  checkTimestamps,
  checkParanoid,
  checkUnderscore,
  checkColumns,
];

export async function checkAll(model: ModelCtor<Model<any, any>>) {
  for (const checker of checkers) {
    await checker(model);
  }
}
