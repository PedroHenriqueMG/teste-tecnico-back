import { Router } from "express";
import { v1Router } from "./v1/v1Router";
import swaggerUi from "swagger-ui-express";
import { document } from "../swagger/swagger";

export const router = Router();

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(document));
router.use("/v1", v1Router)
