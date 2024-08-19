import { Model, ModelCtor, Sequelize } from "sequelize";
import { snakeToCamel } from "./../utils/converts";
import { formatColumn, formatModel } from "../utils/messages";
import { getTableColumns } from "../utils/database";
import { Problem } from "../types";

const checkerName = "columns";

export async function checkColumns(
  model: ModelCtor<Model<any, any>>,
  sequelize: Sequelize,
): Promise<Problem[]> {
  const attributes = model.getAttributes();
  const columnsModel = Object.keys(attributes);
  const problems: Problem[] = [];

  const objectsWithColumns = await getTableColumns(model.tableName, sequelize);
  const columnsDb = objectsWithColumns.map((item) =>
    snakeToCamel(item.column_name),
  );

  const allColumns = Array.from(new Set([...columnsDb, ...columnsModel]));

  const missingColumns = allColumns.filter((item) => {
    return columnsModel.indexOf(item) < 0;
  });
  const excessColumns = allColumns.filter((item) => {
    return columnsDb.indexOf(item) < 0;
  });

  for (const column of missingColumns) {
    problems.push({
      checker: checkerName,
      type: "error",
      message: `Model ${formatModel(model.name)} miss column ${formatColumn(column)}.`,
    });
  }
  for (const column of excessColumns) {
    problems.push({
      checker: checkerName,
      type: "error",
      message: `Model '${formatModel(model.name)}' has excess column ${formatColumn(column)}.`,
    });
  }

  return problems;
}
