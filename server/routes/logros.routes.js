import { Router } from "express";
const router = Router();
import ctrl from "../controllers/logros.controles.js";

router.get("/cha", ctrl.getLogros);

router.get("/cha/:id", ctrl.getoneLogro);

router.post("/cha", ctrl.createLogro);

router.put("/cha/:id", ctrl.uptadateLogro);

router.delete("/cha/:id", ctrl.deleteLogro);

export default router;
