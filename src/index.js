import express from "express";
import { PORT } from "./config.js";
import usersRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use(usersRoutes);

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
