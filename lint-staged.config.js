import fs from "node:fs/promises";
import path from "node:path";

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": [runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
  "*.{ts,mts,cts,tsx}": async (absoluteFilePaths) => {
    const SEPARATOR = " ";
    const relativeFilePaths = getRelativePaths(absoluteFilePaths);
    const listOfFiles = relativeFilePaths.join(SEPARATOR);
    const tsConfigs = await getPathsToTsconfigs(relativeFilePaths);
    const commands = getRelativePaths(tsConfigs).map((tsConfig) => `tsc --noEmit -p ${tsConfig}`);
    return [
      `concurrently ${commands.map((command) => `"${command}"`).join(SEPARATOR)}`,
      runEslint(listOfFiles),
      runPrettier(listOfFiles),
    ];
  },
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

const CURRENT_DIRECTORY = import.meta.dirname;

/**
 * @param {string[]} files
 */
function getRelativePaths(files) {
  return files.map((directory) => path.relative(CURRENT_DIRECTORY, directory));
}

/**
 * @param {string[]} files
 */
async function getPathsToTsconfigs(files) {
  const TSCONFIG_FILE_NAME = "tsconfig.json";

  /** @type {Set<string>} */
  const directoriesWithTsconfig = new Set();

  for (const file of files) {
    let directory = path.resolve(path.dirname(file));
    while (true) {
      const content = await fs.readdir(directory);
      const containsTsconfig = content.includes(TSCONFIG_FILE_NAME);
      if (containsTsconfig) {
        directoriesWithTsconfig.add(directory);
        break;
      }
      if (directory === CURRENT_DIRECTORY) {
        break;
      }
      directory = path.dirname(directory);
    }
  }

  return [...directoriesWithTsconfig];
}

export default config;
