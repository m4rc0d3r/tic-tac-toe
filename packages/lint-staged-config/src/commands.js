import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const LINT_STAGED_CONFIG_FILE_NAMES = ["lint-staged.config.js"];

const PRETTIER_COMMAND = "prettier --write";
const STYLELINT_COMMAND = "stylelint --fix";
const ESLINT_COMMAND = "eslint --fix --flag unstable_config_lookup_from_file";
const TSC_COMMAND = "tsc --noEmit -p";
const SYNCPACK_FORMAT_COMMAND = "syncpack format --source";

/**
 * @param {string} command
 * @param {string[]} [additionalArgs]
 */
function executeCommand(command, additionalArgs) {
  return additionalArgs ? `${command} ${additionalArgs}` : command;
}

/** @param {string[]} [listOfFiles] */
function runPrettier(listOfFiles) {
  return executeCommand(PRETTIER_COMMAND, listOfFiles);
}

/** @param {string[]} [listOfFiles] */
function runStylelint(listOfFiles) {
  return executeCommand(STYLELINT_COMMAND, listOfFiles);
}

/** @param {string[]} [listOfFiles] */
function runEslint(listOfFiles) {
  return executeCommand(ESLINT_COMMAND, listOfFiles);
}

/** @param {string} pathToProject */
function runTsc(pathToProject) {
  return executeCommand(TSC_COMMAND, pathToProject);
}

/** @param {string[]} listOfFiles */
async function runSyncpackFormat(listOfFiles) {
  const files = await Promise.all(
    listOfFiles.map(async (file) => {
      const relativePath = path.relative(process.cwd(), file);
      const directoryContents = await fs.readdir(path.dirname(relativePath));
      return LINT_STAGED_CONFIG_FILE_NAMES.some((fileName) => directoryContents.includes(fileName))
        ? path.basename(relativePath)
        : relativePath;
    }),
  );

  const glob = files.length === 1 ? files.at(0) : `'{${files.join()}}'`;

  return executeCommand(SYNCPACK_FORMAT_COMMAND, glob);
}

export { runEslint, runPrettier, runStylelint, runSyncpackFormat, runTsc };
