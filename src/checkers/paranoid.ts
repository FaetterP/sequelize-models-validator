import { Model, ModelCtor } from "sequelize";

export function checkParanoid(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();
  const keys = Object.keys(attributes);

  if (!options.paranoid) {
    return;
  }

  if (!options.timestamps) {
    console.log(
      `[${"ERROR".red} paranoid] ${model.tableName}: paranoid is true, but timestamps not enabled.`
    );
  }

  let deletedAtName = options.underscored ? "deletedAt" : "deleted_at";

  if (!keys.includes(deletedAtName)) {
    console.log(`[${"WARN".yellow} paranoid] Model '${model.name}' doesn't contain '${deletedAtName}'.`);
  }
}
