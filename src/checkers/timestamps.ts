import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel } from "../utils/messages";
import { Problem } from "../types";

const checkerName = "timestamps";

export function checkTimestamps(model: ModelCtor<Model<any, any>>): Problem[] {
  const { timestamps, underscored } = model.options;
  const attributes = model.getAttributes();
  const problems: Problem[] = [];

  if (timestamps) {
    const createdAtName = underscored ? "created_at" : "createdAt";
    const updatedAtName = underscored ? "updated_at" : "updatedAt";

    if (!(createdAtName in attributes)) {
      problems.push({
        checker: checkerName,
        type: "warning",
        message: `Model ${formatModel(model.name)} doesn't contain ${formatColumn(createdAtName)}.`,
      });
    }

    if (!(updatedAtName in attributes)) {
      problems.push({
        checker: checkerName,
        type: "warning",
        message: `Model ${formatModel(model.name)} doesn't contain ${formatColumn(updatedAtName)}.`,
      });
    }
  }

  return problems;
}
