import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import config from "config";
import path from "node:path";

type SeparatedOptions = {
  dialect?: Dialect;
  host: string;
  port: number;
  database: string;
  user?: string;
  username?: string;
  password: string;
};

type URIOptions = {
  uri: string;
};

type SQLLiteOptions = {
  dialect: "sqlite";
  storage: string;
};

type ConnectionOptionsType = SeparatedOptions | URIOptions | SQLLiteOptions;

let sequelize: Sequelize | undefined;

export async function connect(): Promise<Sequelize> {
  const options = config.get<ConnectionOptionsType>("db");
  const fullPath = path.join(process.cwd(), process.argv[2]);

  const sqlLiteOptions = options as SQLLiteOptions;
  if (sqlLiteOptions.storage) {
    sequelize = new Sequelize({
      dialect: sqlLiteOptions.dialect,
      storage: sqlLiteOptions.storage,
    });

    return sequelize
  }

  const uriOptions = options as URIOptions
  if(uriOptions.uri){
    sequelize = new Sequelize(uriOptions.uri)
    
    return sequelize
  }

  const separatedOptions = options as SeparatedOptions
  sequelize = new Sequelize({
    dialect: separatedOptions.dialect || "postgres",
    host: separatedOptions.host,
    port: separatedOptions.port,
    database: separatedOptions.database,
    username: separatedOptions.user || separatedOptions.username,
    password: separatedOptions.password,
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
