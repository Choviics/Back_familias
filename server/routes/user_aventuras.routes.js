import { Router } from "express";
const router = Router();
import ctrl from "../controllers/user_aventuras.controles.js";

router.get("/useradv/:aventura_id", ctrl.getUsersAventura);

router.post("/useradv/:aventura_id", ctrl.createUserAventura);

router.delete("/useradv/:aventura_id", ctrl.deleteUserAventura)

export default router;