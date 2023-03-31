import { Sequelize } from "sequelize-typescript";
import { Dialect, PoolOptions } from "sequelize";
import config from "config";

export type ConnectionOptionsType = {
  dialect?: Dialect;
  host: string;
  database: string;
  user: string;
  password: string;
};

export async function connect(): Promise<Sequelize> {
  const options = config.get<ConnectionOptionsType>("db");

  const sequelize = new Sequelize({
    dialect: options.dialect || "postgres",
    host: options.host,
    database: options.database,
    username: options.user,
    password: options.password,
    models: [process.argv[2]],
  });

  return sequelize;
}
