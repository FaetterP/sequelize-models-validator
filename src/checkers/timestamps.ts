import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel, getWarning } from "../utils/messages";

const checkerName = "timestamps";

export function checkTimestamps(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();
  const keys = Object.keys(attributes);

  if (!options.timestamps) {
    return;
  }

  let createdAtName = options.underscored ? "createdAt" : "created_at";
  let updatedAtName = options.underscored ? "updatedAt" : "updated_at";

  if (!keys.includes(createdAtName)) {
    const message = getWarning(
      checkerName,
      `Model ${formatModel(model.name)} doesn't contain ${formatColumn(createdAtName)}.`
    );
    console.log(message);
  }
  if (!keys.includes(updatedAtName)) {
    const message = getWarning(
      checkerName,
      `Model ${formatModel(model.name)} doesn't contain ${formatColumn(updatedAtName)}.`
    );
    console.log(message);
  }
}
