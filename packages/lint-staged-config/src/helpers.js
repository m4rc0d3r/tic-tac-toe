import { runEslint, runPrettier, runTsc } from "./commands.js";

/**
 * @typedef {object} Option
 * @property {string} glob
 * @property {string} pathToConfigFile
 */

/**
 * @param {Option[]} options
 */
function setUpTasksForTypescriptFiles(options) {
  return options.reduce((acc, { glob, pathToConfigFile }) => {
    acc[glob] = (files) => {
      const listOfFiles = files.join(" ");
      return [runTsc(pathToConfigFile), runEslint(listOfFiles), runPrettier(listOfFiles)];
    };
    return acc;
  }, {});
}

export { setUpTasksForTypescriptFiles };
