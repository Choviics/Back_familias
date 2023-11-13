import express from "express";
import { PORT } from "./config.js";
import session from "express-session";
import crypto from "crypto";
import cors from "cors"
const store = new session.MemoryStore();
//rutas
import usersRoutes from "./routes/user.routes.js";
import newsRoutes from "./routes/news.routes.js";
import convenioRoutes from "./routes/convenios.routes.js";
import seccionRoutes from "./routes/seccion.routes.js";
import logrosRoutes from "./routes/logros.routes.js";
import retoRoutes from "./routes/retos.routes.js";
import pasosRoutes from "./routes/pasos.routes.js";
import retoComents from "./routes/retocoments.routes.js";
import logroscoments from "./routes/logroscoments.routes.js";
import aventurasRoutes from "./routes/aventuras.routes.js";
import useraventuras from "./routes/user_aventuras.routes.js";

//https
import fs from 'fs';
import https from 'https'


const app = express();

app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    store
  })
);

app.use(express.json());
app.use(cors({origin:true}))
app.use(usersRoutes);
app.use(newsRoutes);
app.use(convenioRoutes);
app.use(seccionRoutes);
app.use(logrosRoutes);
app.use(retoRoutes);
app.use(pasosRoutes);
app.use(retoComents);
app.use(logroscoments);
app.use(aventurasRoutes);
app.use(useraventuras);

https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('privkey.pem')
}, app).listen(PORT, function(){
  console.log(`Server is running on port ${PORT}`);
});