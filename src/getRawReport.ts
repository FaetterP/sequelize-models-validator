import { checkAll } from "./checkers";
import { connect } from "./libs/sequelize";
import { Config, Problem } from "./types";

export async function getRawReport(config: Config): Promise<Problem[]> {
  const report: Problem[] = [];
  const sequelize = await connect(config.sequelize);

  const rawModels = sequelize.models;
  const models = Object.values(rawModels);

  for (const model of models) {
    const modelProblems = await checkAll(model, sequelize);
    report.push(...modelProblems);
  }

  return report;
}
