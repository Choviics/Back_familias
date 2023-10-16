import { Router } from "express";
const router = Router();
import ctrl from "../controllers/news.controles.js";

router.get("/news", ctrl.getNews);

router.get("/news/:id", ctrl.getoneNew);

router.post("/news", ctrl.createNew);

router.put("/news/:id", ctrl.uptadateNews)

router.delete("/news/:id", ctrl.deleteNew)

export default router;