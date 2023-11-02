import { Router } from "express";
const router = Router();
import ctrl from "../controllers/logroscoments.controles.js";

router.post("/lc/:logro_id", ctrl.createLogroComent);

router.put("/lc/:id", ctrl.uptadateLogroComent)

router.delete("/lc/:id", ctrl.deleteLogroComent)

export default router;