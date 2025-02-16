import { runEslint, runPrettier, runTsc } from "./commands.js";

/**
 * @template {string} TaskName
 * @typedef {object} Option
 * @property {string} glob
 * @property {string} pathToConfigFile
 * @property {Record<TaskName,string | (files: string[]) => string>} [additionalTasks]
 * @property {Partial<LaunchOptions<TaskName>>} [launchOptions]
 */

/** @typedef {"prettier" | "eslint" | "tsc"} DefaultTaskName */

/**
 * @template {string} TaskName
 * @typedef {Record<DefaultTaskName | TaskName, boolean>} LaunchOptions
 */

/**
 * @template {string} [TaskName=string] Default is `string`
 * @param {Option<TaskName>[]} options
 */
function setUpTasksForTypescriptFiles(options) {
  return options.reduce((acc, { glob, pathToConfigFile, additionalTasks, launchOptions }) => {
    acc[glob] = (files) => {
      const listOfFiles = files.join(" ");

      const defaultTasks = Object.entries({
        tsc: runTsc(pathToConfigFile),
        eslint: runEslint(listOfFiles),
        prettier: runPrettier(listOfFiles),
      });

      /** @type {[string, string][]} */
      const additionalTasks2 = Object.entries(additionalTasks ?? {}).map(([name, command]) => [
        name,
        typeof command === "string" ? command : command(listOfFiles),
      ]);

      return getTasksToRun(
        [...defaultTasks, ...additionalTasks2],
        Object.entries(launchOptions ?? {}),
      ).map(([, command]) => command);
    };
    return acc;
  }, {});
}

/**
 * @template {string} [TaskName=string] Default is `string`
 * @param {[DefaultTaskName | TaskName, string][]} tasks
 * @param {[DefaultTaskName | TaskName, boolean][]} launchOptions
 * @returns {[DefaultTaskName | TaskName, string][]}
 */
function getTasksToRun(tasks, launchOptions) {
  const unspecifiedTasks = tasks.filter(([name]) =>
    launchOptions.every(([name2]) => name !== name2),
  );

  return [
    ...launchOptions
      .filter(([, execute]) => execute)
      .map(([name]) => [name, tasks.find((task) => task.at(0) === name).at(1)]),
    ...unspecifiedTasks,
  ];
}

export { setUpTasksForTypescriptFiles };
