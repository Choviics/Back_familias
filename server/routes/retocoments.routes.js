import { Router } from "express";
const router = Router();
import ctrl from "../controllers/retocoments.controles.js";

router.post("/rc/:aventura_id", ctrl.createRetoComent);

router.put("/rc/:id", ctrl.uptadateRetoComent)

router.delete("/rc/:id", ctrl.deleteRetoComent)

export default router;