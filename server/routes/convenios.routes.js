import { Router } from "express";
const router = Router();
import ctrl from "../controllers/convenios.controles.js";

router.get("/conv", ctrl.getConvenios);

router.get("/conv/:id", ctrl.getoneConvenio);

router.get("/conv/filter/:id", ctrl.getFilterConv)

router.post("/conv", ctrl.createConvenio);

router.put("/conv/:id", ctrl.uptadateConvenio);

router.delete("/conv/:id", ctrl.deleteConvenio);

export default router;
