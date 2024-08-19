import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel } from "../utils/messages";
import { Problem } from "../types";

const checkerName = "paranoid";

export function checkParanoid(model: ModelCtor<Model<any, any>>): Problem[] {
  const { paranoid, timestamps, underscored } = model.options;
  const attributes = model.getAttributes();
  const problems: Problem[] = [];

  if (paranoid) {
    if (!timestamps) {
      problems.push({
        checker: checkerName,
        type: "error",
        message: `${formatModel(model.tableName)}: paranoid is true, but timestamps not enabled.`,
      });
    }

    const deletedAtName = underscored ? "deletedAt" : "deleted_at";

    if (!(deletedAtName in attributes)) {
      problems.push({
        checker: checkerName,
        type: "error",
        message: `Model ${formatModel(model.name)} doesn't contain ${formatColumn(deletedAtName)}.`,
      });
    }
  }

  return problems;
}
