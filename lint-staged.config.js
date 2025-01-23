/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": [runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
};

/**
 * @param {string} command
 * @param {string[]} [listOfFiles]
 */
function executeCommand(command, listOfFiles) {
  return listOfFiles ? `${command} ${listOfFiles}` : command;
}

/**
 * @param {string[]} [listOfFiles]
 */
function runPrettier(listOfFiles) {
  return executeCommand("prettier --write", listOfFiles);
}

/**
 * @param {string[]} [listOfFiles]
 */
function runEslint(listOfFiles) {
  return executeCommand("eslint --fix --flag unstable_config_lookup_from_file", listOfFiles);
}

export default config;
