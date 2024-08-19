import { Config, Envs } from "../types";

export function getConfigValues(envs: Envs): Config {
  return {
    sequelize: {
      database: process.env[envs.database] || "postgres",
      dialect: (process.env[envs.dialect] as any) || "postgres",
      host: process.env[envs.host] || "localhost",
      modelsPath: envs.modelsPath || "./src/models",
      password: process.env[envs.password] || "",
      port: +process.env[envs.port]! || 5432,
      uri: process.env[envs.uri],
      username: process.env[envs.username] || "postgres",
    },
  };
}
