import { createConfig, useConfigStore } from "../shared/config";

type ConfiguratorProps = {
  variables?: Parameters<typeof createConfig>[0] | undefined;
};

function Configurator({ variables = import.meta.env }: ConfiguratorProps) {
  useConfigStore.setState(createConfig(variables));

  return null;
}

export { Configurator };
