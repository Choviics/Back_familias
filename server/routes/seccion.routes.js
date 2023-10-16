import { Router } from "express";
const router = Router();
import ctrl from "../controllers/seccion.controles.js";

router.get("/secc", ctrl.getSeccs);

router.get("/secc/:id", ctrl.getoneSecc);

router.post("/secc", ctrl.createSecc);

router.put("/secc/:id", ctrl.uptadateSecc)

router.delete("/secc/:id", ctrl.deleteSecc)

export default router;