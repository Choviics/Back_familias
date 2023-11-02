import { Router } from "express";
const router = Router();
import ctrl from "../controllers/logros.controles.js";

router.get("/ach", ctrl.getLogros);

router.get("/ach/:id", ctrl.getoneLogro);

router.post("/ach", ctrl.createLogro);

router.put("/ach/:id", ctrl.uptadateLogro);

router.delete("/ach/:id", ctrl.deleteLogro);

export default router;
