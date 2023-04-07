import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import config from "config";
import path from "node:path";

export type ConnectionOptionsType = {
  dialect?: Dialect;
  host: string;
  database: string;
  user?: string;
  username?: string;
  password: string;
};

let sequelize: Sequelize | undefined;

export async function connect(): Promise<Sequelize> {
  const options = config.get<ConnectionOptionsType>("db");
  const fullPath = path.join(process.cwd(), process.argv[2]);

  sequelize = new Sequelize({
    dialect: options.dialect || "postgres",
    host: options.host,
    database: options.database,
    username: options.user || options.username,
    password: options.password,
    models: [fullPath],
    logging: false,
  });

  return sequelize;
}

export async function getSequelize(): Promise<Sequelize> {
  if (!sequelize) {
    await connect();
  }

  return sequelize!;
}
