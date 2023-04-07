import colors from "colors";

export function getWarning(name: string, message: string) {
  return `[${colors.yellow("WARN")} ${name}] ${message}`;
}

export function getError(name: string, message: string) {
  return `[${colors.red("ERROR")} ${name}] ${message}`;
}

export function formatModel(name: string) {
  return colors.green(`'${name}'`);
}

export function formatColumn(name: string) {
  return colors.blue(`'${name}'`);
}
