const PRETTIER_COMMAND = "prettier --write";
const STYLELINT_COMMAND = "stylelint --fix";
const ESLINT_COMMAND = "eslint --fix --flag unstable_config_lookup_from_file";
const TSC_COMMAND = "tsc --noEmit -p";

/**
 * @param {string} command
 * @param {string[]} [additionalArgs]
 */
function executeCommand(command, additionalArgs) {
  return additionalArgs ? `${command} ${additionalArgs}` : command;
}

/**
 * @param {string[]} [listOfFiles]
 */
function runPrettier(listOfFiles) {
  return executeCommand(PRETTIER_COMMAND, listOfFiles);
}

/**
 * @param {string[]} [listOfFiles]
 */
function runStylelint(listOfFiles) {
  return executeCommand(STYLELINT_COMMAND, listOfFiles);
}

/**
 * @param {string[]} [listOfFiles]
 */
function runEslint(listOfFiles) {
  return executeCommand(ESLINT_COMMAND, listOfFiles);
}

/**
 * @param {string} pathToProject
 */
function runTsc(pathToProject) {
  return executeCommand(TSC_COMMAND, pathToProject);
}

export { runEslint, runPrettier, runStylelint, runTsc };
