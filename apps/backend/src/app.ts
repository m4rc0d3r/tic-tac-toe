import type { FastifyPluginAsync } from "fastify";

const app: FastifyPluginAsync = async (_fastify, _opts): Promise<void> => {
  await Promise.resolve();
};

export default app;
export { app };
