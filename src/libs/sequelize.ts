import { Sequelize } from "sequelize-typescript";
import path from "node:path";
import { ConnectionOptionsType } from "../types";

export async function connect(
  options: any,
): Promise<Sequelize> {
  const modelsPath = path.join(process.cwd(), options.modelsPath!);

  if (options.storage) {
    var sequelize = new Sequelize({
      dialect: "sqlite",
      storage: options.storage,
      models: [modelsPath],
      logging: false,
    });
  } else if (options.uri) {
    sequelize = new Sequelize(options.uri, {
      models: [modelsPath],
      logging: false,
    });
  } else {
    sequelize = new Sequelize({
      dialect: options.dialect || "postgres",
      host: options.host,
      port: options.port,
      database: options.database,
      username: options.username,
      password: options.password,
      models: [modelsPath],
      logging: false,
    });
  }

  return sequelize;
}
