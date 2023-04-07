import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel, getError } from "../utils/messages";

const checkerName = "paranoid";

export function checkParanoid(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();
  const keys = Object.keys(attributes);

  if (!options.paranoid) {
    return;
  }

  if (!options.timestamps) {
    const message = getError(
      checkerName,
      `${formatModel(model.tableName)}: paranoid is true, but timestamps not enabled.`
    );
    console.log(message);
  }

  let deletedAtName = options.underscored ? "deletedAt" : "deleted_at";

  if (!keys.includes(deletedAtName)) {
    const message = getError(checkerName, `Model ${formatModel(model.name)} doesn't contain ${formatColumn(deletedAtName)}.`)
    console.log(message);
  }
}
