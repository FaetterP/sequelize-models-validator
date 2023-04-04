import { Model, ModelCtor } from "sequelize";
import colors from "colors"

export function checkParanoid(model: ModelCtor<Model<any, any>>) {
  const options = model.options;
  const attributes = model.getAttributes();
  const keys = Object.keys(attributes);

  if (!options.paranoid) {
    return;
  }

  if (!options.timestamps) {
    console.log(
      `[${colors.red("ERROR")} paranoid] ${model.tableName}: paranoid is true, but timestamps not enabled.`
    );
  }

  let deletedAtName = options.underscored ? "deletedAt" : "deleted_at";

  if (!keys.includes(deletedAtName)) {
    console.log(`[${colors.yellow("WARN")} paranoid] Model '${model.name}' doesn't contain '${deletedAtName}'.`);
  }
}
