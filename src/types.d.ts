import { Dialect } from "sequelize";

interface BaseOptions {
  dialect?: Dialect;
  modelsPath?: string;
}

interface SeparatedOptions extends BaseOptions {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface URIOptions extends BaseOptions {
  uri: string;
}

interface SQLLiteOptions extends BaseOptions {
  dialect: "sqlite";
  storage: string;
}

export type ConnectionOptionsType =
  | SeparatedOptions
  | URIOptions
  | SQLLiteOptions;

export type Problem = {
  checker: string;
  type: "warning" | "error";
  message: string;
};

export type Envs = {
  database: string;
  dialect: string;
  host: string;
  modelsPath: string;
  password: string;
  port: string;
  uri: string;
  username: string;
};

export type Config = {
  sequelize: ConnectionOptionsType;
};
