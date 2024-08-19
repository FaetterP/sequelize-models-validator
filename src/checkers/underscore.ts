import { Model, ModelCtor } from "sequelize";
import { formatColumn, formatModel } from "../utils/messages";
import { Problem } from "../types";

const checkerName = "underscore";

export function checkUnderscore(model: ModelCtor<Model<any, any>>): Problem[] {
  const { underscored } = model.options;
  const attributes = model.getAttributes();
  const problems: Problem[] = [];

  if (underscored) {
    for (const field in attributes) {
      if (field.includes("_")) {
        problems.push({
          checker: checkerName,
          type: "warning",
          message: `Model ${formatModel(model.name)} contains field ${formatColumn(field)}.`,
        });
      }
    }
  }

  return problems;
}
