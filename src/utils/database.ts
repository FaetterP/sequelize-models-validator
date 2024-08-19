import { QueryTypes, Sequelize } from "sequelize";

export async function getTableColumns(tableName: string, sequelize: Sequelize) {
  const objectsWithColumn = await sequelize!.query<{
    column_name: string;
  }>(
    `SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`,
    { type: QueryTypes.SELECT },
  );

  return objectsWithColumn;
}

export async function getColumnType(
  tableName: string,
  columnName: string,
  sequelize: Sequelize,
) {
  const objectsWithColumn = await sequelize!.query<{
    data_type: string;
  }>(
    `SELECT data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}'`,
    { type: QueryTypes.SELECT },
  );

  if (!objectsWithColumn.length) {
    return null;
  }
  return objectsWithColumn[0].data_type;
}
