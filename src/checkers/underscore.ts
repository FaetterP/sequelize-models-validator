import { Model, ModelCtor } from "sequelize";

export function checkUnderscore(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();

  if (!options.underscored) {
    return;
  }

  for (const key in attributes) {
    if (key.includes("_")) {
      console.log(`[${"WARN".yellow} underscore] Model '${model.name}' contains field '${key}'.`);
    }
  }
}
