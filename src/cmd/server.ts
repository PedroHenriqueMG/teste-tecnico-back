import "express-async-errors";
import Express from "express";
import {router} from "../internal/infrastructure/router/routes";
import { errosMiddleware } from "../internal/infrastructure/middleware/error";


export const server = Express();
server.use(Express.json());

server.use(router);

server.use(errosMiddleware);
