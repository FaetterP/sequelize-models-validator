import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel, getWarning } from "../utils/messages";

const checkerName = "underscore";

export function checkUnderscore(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();

  if (!options.underscored) {
    return;
  }

  for (const field in attributes) {
    if (field.includes("_")) {
      const message = getWarning(
        checkerName,
        `Model ${formatModel(model.name)} contains field ${formatColumn(field)}.`
      );
      console.log(message);
    }
  }
}
