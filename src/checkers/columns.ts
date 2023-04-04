import { Model, ModelCtor, QueryTypes } from "sequelize";
import { snakeToCamel } from "./../utils/converts";
import { getSequelize } from "../libs/sequelize";

export async function checkColumns(model: ModelCtor<Model<any, any>>) {
  const attributes = model.getAttributes();
  const columnsModel = Object.keys(attributes);

  const sequelize = await getSequelize();
  const objectsWithColumns = await sequelize!.query<{
    column_name: string;
  }>(
    `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'${model.tableName}'`,
    { type: QueryTypes.SELECT }
  );
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
    console.log(`[${"ERROR".red} column] Model '${model.name}' miss column '${column}'.`);
  }
  for (const column of excessColumns) {
    console.log(`[${"ERROR".red} column] Model '${model.name}' has excess column '${column}'.`);
  }
}
