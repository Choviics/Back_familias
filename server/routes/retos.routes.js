import { Router } from "express";
const router = Router();
import ctrl from "../controllers/retos.controles.js";

router.get("/chall", ctrl.getRetos);

router.get("/chall/:id", ctrl.getoneReto);

router.post("/chall", ctrl.createReto);

router.put("/chall/:id", ctrl.uptadateReto)

router.delete("/chall/:id", ctrl.deleteReto)

export default router;