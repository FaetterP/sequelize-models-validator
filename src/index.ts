import { checkAll } from "./checkers";
import { connect } from "./libs/sequelize";

(async () => {
  const sequelize = await connect();

  const rawModels = sequelize.models;
  const models = Object.values(rawModels);

  for (const model of models) {
    await checkAll(model);
  }
})();
