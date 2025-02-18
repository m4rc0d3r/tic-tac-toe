import { createConfig, useConfigStore } from "../shared/config";

type Props = {
  variables?: Parameters<typeof createConfig>[0] | undefined;
};

function Configurator({ variables = import.meta.env }: Props) {
  useConfigStore.setState(createConfig(variables));

  return null;
}

export { Configurator };
