import {app} from './config/express';
import {config} from "./config";
import type {Request, Response} from "express";

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(config.app.port, config.app.host, () => {
    console.log(`Server running at http://${config.app.host}:${config.app.port}`);
    console.log(`Environment: ${config.app.env}`);
});