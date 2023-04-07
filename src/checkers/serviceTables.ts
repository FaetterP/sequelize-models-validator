import { Model, ModelCtor, QueryTypes } from "sequelize";
import { formatModel, getError } from "../utils/messages";
import { getSequelize } from "../libs/sequelize";

const checkerName = "service-tables";
let tables: string[] = [];

export async function checkParanoid(model: ModelCtor<Model<any, any>>) {
  if (tables.length === 0) {
    const sequelize = await getSequelize();
    const objectsWithTables = await sequelize!.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables`,
      { type: QueryTypes.SELECT }
    );
    tables = objectsWithTables.map((item) => item.table_name);
  }

  if (tables.includes(model.tableName)) {
    const message = getError(
      checkerName,
      `Table with name ${formatModel(model.tableName)} is service table in database.`
    );
    console.log(message);
  }
}
