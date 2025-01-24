/**
 * @type {import('syncpack').RcFile}
 */
const config = {
  versionGroups: [
    {
      label: "Use workspace protocol for local packages",
      dependencies: ["$LOCAL"],
      dependencyTypes: ["dev", "peer", "prod"],
      pinVersion: "workspace:*",
    },
  ],
};

export default config;
