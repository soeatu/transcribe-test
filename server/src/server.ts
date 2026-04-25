import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const PORT = env.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server started on port ${PORT} (${env.nodeEnv})`);
  logger.info(`   Health check: http://localhost:${PORT}/health`);
  logger.info(`   API base:     http://localhost:${PORT}/api`);
});
