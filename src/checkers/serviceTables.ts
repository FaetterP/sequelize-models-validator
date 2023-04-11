import { Model, ModelCtor, QueryTypes } from "sequelize";
import { formatModel, getError } from "../utils/messages";
import { getSequelize } from "../libs/sequelize";

const checkerName = "service-tables";
let tables: string[] = [];

export async function checkServiceTables(model: ModelCtor<Model<any, any>>) {
  if (tables.length === 0) {
    const sequelize = await getSequelize();
    const objectsWithTables = await sequelize!.query<[string]>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='information_schema' OR table_schema='pg_catalog';`,
      { type: QueryTypes.SELECT }
    );
    tables = objectsWithTables.map((item) => item[0]);
  }

  if (tables.includes(model.tableName)) {
    const message = getError(
      checkerName,
      `Table with name ${formatModel(
        model.tableName
      )} is service table in database.`
    );
    console.log(message);
  }
}
