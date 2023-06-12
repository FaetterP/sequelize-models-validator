import { Model, ModelCtor } from "sequelize";
import { snakeToCamel } from "./../utils/converts";
import { formatColumn, formatModel, getError } from "../utils/messages";
import { getTableColumns } from "../utils/database";

const checkerName = "columns";

export async function checkColumns(model: ModelCtor<Model<any, any>>) {
  const attributes = model.getAttributes();
  const columnsModel = Object.keys(attributes);

  const objectsWithColumns = await getTableColumns(model.tableName);
  const columnsDb = objectsWithColumns.map((item) =>
    snakeToCamel(item.column_name)
  );

  const allColumns = Array.from(new Set([...columnsDb, ...columnsModel]));

  const missingColumns = allColumns.filter((item) => {
    return columnsModel.indexOf(item) < 0;
  });
  const excessColumns = allColumns.filter((item) => {
    return columnsDb.indexOf(item) < 0;
  });

  for (const column of missingColumns) {
    const message = getError(
      checkerName,
      `Model ${formatModel(model.name)} miss column ${formatColumn(column)}.`
    );
    console.log(message);
  }
  for (const column of excessColumns) {
    const message = getError(
      checkerName,
      `Model '${formatModel(model.name)}' has excess column ${formatColumn(column)}.`
    );
    console.log(message);
  }
}
