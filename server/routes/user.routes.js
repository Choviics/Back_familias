import { Router } from "express";
const router = Router();
import ctrl from "../controllers/user.controles.js";

router.get("/users", ctrl.getUsers);

router.get("/users/:id", ctrl.getoneUser);

router.post("/users", ctrl.createUsers);

router.post("/users/login", ctrl.login)

router.put("/users/:id", ctrl.uptadateUsers)

router.delete("/users/:id", ctrl.deleteUsers)

export default router;
