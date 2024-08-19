import { Model, ModelCtor, QueryTypes, Sequelize } from "sequelize";
import { formatModel } from "../utils/messages";
import { Problem } from "../types";

const checkerName = "service-tables";
let tables: string[] = [];

export async function checkServiceTables(
  model: ModelCtor<Model<any, any>>,
  sequelize: Sequelize,
): Promise<Problem[]> {
  const problems: Problem[] = [];

  if (tables.length === 0) {
    const objectsWithTables = await sequelize!.query<[string]>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='information_schema' OR table_schema='pg_catalog';`,
      { type: QueryTypes.SELECT },
    );
    tables = objectsWithTables.map((item) => item[0]);
  }

  if (tables.includes(model.tableName)) {
    problems.push({
      checker: checkerName,
      type: "error",
      message: `Table with name ${formatModel(model.tableName)} is service table in database.`,
    });
  }

  return problems;
}
