import {app} from './config/express';
import {config} from "./config";
import type {Request, Response} from "express";
import {logger} from "./config/logger";

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(config.app.port, config.app.host, () => {
    logger.info(`Server running at http://${config.app.host}:${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
});