import { Model, ModelCtor } from "sequelize";
import colors from "colors"

export function checkUnderscore(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();

  if (!options.underscored) {
    return;
  }

  for (const key in attributes) {
    if (key.includes("_")) {
      console.log(`[${colors.yellow("WARN")} underscore] Model '${model.name}' contains field '${key}'.`);
    }
  }
}
