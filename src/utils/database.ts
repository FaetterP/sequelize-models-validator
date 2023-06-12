import { AbstractDataTypeConstructor, QueryTypes } from "sequelize";
import { getSequelize } from "../libs/sequelize";
import { DataType } from "sequelize-typescript";

export async function getTableColumns(tableName: string) {
  const sequelize = await getSequelize();
  const objectsWithColumn = await sequelize!.query<{
    column_name: string;
  }>(
    `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`,
    { type: QueryTypes.SELECT }
  );

  return objectsWithColumn;
}

export async function getColumnType(tableName: string, columnName: string) {
  const sequelize = await getSequelize();
  const objectsWithColumn = await sequelize!.query<{
    data_type: string;
  }>(
    `SELECT data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}'`,
    { type: QueryTypes.SELECT }
  );

  if (!objectsWithColumn.length) {
    throw new Error(`column '${tableName}/${columnName}' not found`);
  }
  return objectsWithColumn[0].data_type;
}
