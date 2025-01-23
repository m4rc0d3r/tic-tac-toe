import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CURRENT_DIRECTORY = process.cwd();
const TSCONFIG_FILE_NAMES = ["tsconfig.json", "tsconfig.app.json", "tsconfig.node.json"];

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{json,md,yaml,yml,html,css}": [runPrettier()],
  "*.{js,mjs,cjs,jsx}": [runEslint(), runPrettier()],
  "*.{ts,mts,cts,tsx}": async (absoluteFilePaths) => {
    const SEPARATOR = " ";
    const relativeFilePaths = absoluteFilePaths.map((filePath) =>
      path.relative(CURRENT_DIRECTORY, filePath),
    );
    const listOfFiles = relativeFilePaths.join(SEPARATOR);
    const tsConfigs = await getTsConfigs(relativeFilePaths);
    const commands = tsConfigs.flatMap(([directory, tsConfigs]) =>
      tsConfigs.map(
        (tsConfig) =>
          `tsc --noEmit -p ${path.join(path.relative(CURRENT_DIRECTORY, directory), tsConfig)}`,
      ),
    );
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

/**
 * @param {string[]} files
 */
async function getTsConfigs(files) {
  /** @type {Map<string,string[]>} */
  const directoriesWithTsConfigs = new Map();

  for (const file of files) {
    let directory = path.resolve(path.dirname(file));
    if (directoriesWithTsConfigs.has(directory)) {
      continue;
    }
    while (true) {
      const content = await fs.readdir(directory);
      const containedTsConfigs = TSCONFIG_FILE_NAMES.filter((tsConfigFileName) =>
        content.includes(tsConfigFileName),
      );
      if (containedTsConfigs.length > 0) {
        directoriesWithTsConfigs.set(directory, containedTsConfigs);
        break;
      }
      if (directory === CURRENT_DIRECTORY) {
        break;
      }
      directory = path.dirname(directory);
    }
  }

  return [...directoriesWithTsConfigs.entries()];
}

export default config;
