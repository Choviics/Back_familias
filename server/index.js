import express from "express";
import { PORT } from "./config.js";
import usersRoutes from "./routes/user.routes.js";
import newsRoutes from "./routes/news.routes.js";
import convenioRoutes from "./routes/convenios.routes.js";
import seccionRoutes from "./routes/seccion.routes.js";
import logrosRoutes from "./routes/logros.routes.js";

const app = express();

app.use(express.json());

app.use(usersRoutes);
app.use(newsRoutes);
app.use(convenioRoutes);
app.use(seccionRoutes);
app.use(logrosRoutes);

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
