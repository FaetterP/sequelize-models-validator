import { Model, ModelCtor } from "sequelize";

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
    console.log(`table '${model.name}' doesn't contain '${createdAtName}'`);
  }
  if (!keys.includes(updatedAtName)) {
    console.log(`table '${model.name}' doesn't contain '${updatedAtName}'`);
  }
}
