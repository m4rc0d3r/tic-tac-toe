import { runEslint, runPrettier, runTsc } from "./commands.js";

/**
 * @typedef {object} Option
 * @property {string} glob
 * @property {string} pathToConfigFile
 * @property {Record<string,string | (files: string[]) => string>} [additionalTasks]
 * @property {SequenceOfExecution} [sequenceOfExecution]
 */

/** @typedef {("prettier" | "eslint" | "tsc" | (string & Record<never, never>))[]} SequenceOfExecution */

/** @param {Option[]} options */
function setUpTasksForTypescriptFiles(options) {
  return options.reduce((acc, { glob, pathToConfigFile, additionalTasks, sequenceOfExecution }) => {
    acc[glob] = (files) => {
      const listOfFiles = files.join(" ");

      const normalizedDefaultTasks = Object.entries({
        prettier: runPrettier(listOfFiles),
        eslint: runEslint(listOfFiles),
        tsc: runTsc(pathToConfigFile),
      });

      const normalizedAdditionalTasks = Object.entries(additionalTasks ?? {}).map(
        ([name, command]) => [name, typeof command === "string" ? command : command(listOfFiles)],
      );

      const sequence = normalizeSequence(
        normalizedAdditionalTasks.map(([name]) => name),
        sequenceOfExecution,
      );

      const tasks = [...normalizedDefaultTasks, ...normalizedAdditionalTasks].sort(
        ([aName], [bName]) => sequence.indexOf(aName) - sequence.indexOf(bName),
      );

      return tasks.map(([, command]) => command);
    };
    return acc;
  }, {});
}

const DEFAULT_EXECUTION_SEQUENCE = ["tsc", "eslint", "prettier"];

/**
 * @param {string[]} additionalTasks
 * @param {SequenceOfExecution[]} [sequence]
 */
function normalizeSequence(additionalTasks, sequence) {
  const normalized = new Set(sequence ?? DEFAULT_EXECUTION_SEQUENCE);

  for (const task of [...additionalTasks, ...DEFAULT_EXECUTION_SEQUENCE]) {
    normalized.add(task);
  }

  return [...normalized];
}

export { setUpTasksForTypescriptFiles };
