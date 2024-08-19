#! /usr/bin/env node
import "dotenv/config";
import { getRawReport } from "./getRawReport";
import { Envs } from "./types";
import { getConfigValues } from "./utils/config";
import path from "path";
import { getError, getSuccess, getWarning } from "./utils/messages";

(async () => {
  const envs: Envs = require(
    path.resolve(process.cwd(), "sequelize-validator.json"),
  );
  const config = getConfigValues(envs);
  const report = await getRawReport(config);

  for (const item of report) {
    let message = "";
    if (item.type === "error") {
      message = getError(item.checker, item.message);
    } else if (item.type === "warning") {
      message = getWarning(item.checker, item.message);
    }
    console.log(message);
  }

  if (report.some((problem) => problem.type === "error")) {
    process.exit(1);
  } else if (report.length === 0) {
    console.log(getSuccess());
  }
})();
