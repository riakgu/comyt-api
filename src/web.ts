import { app } from './config/express';
import { config } from "./config";
import { logger } from "./config/logger";

app.listen(config.app.port, config.app.host, () => {
    logger.info(`Server running at http://${config.app.host}:${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
});