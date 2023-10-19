import { Router } from "express";
const router = Router();
import ctrl from "../controllers/aventuras.controles.js";

router.get("/adv", ctrl.getAventuras);

router.get("/adv/:id", ctrl.getoneAventura);

router.post("/adv", ctrl.createAventura);

router.put("/adv/:id", ctrl.uptadateAventura);

router.delete("/adv/:id", ctrl.deleteAventura);

export default router;
