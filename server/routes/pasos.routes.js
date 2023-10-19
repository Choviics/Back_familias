import { Router } from "express";
const router = Router();
import ctrl from "../controllers/pasos.controles.js";

router.get("/pasos/:id", ctrl.getonePaso);

router.post("/pasos", ctrl.createPaso);

router.put("/pasos/:id", ctrl.uptadatePaso)

router.delete("/pasos/:id", ctrl.deletePaso)

export default router;