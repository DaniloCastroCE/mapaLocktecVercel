import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import router from "./src/router/router.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(router);

export default app;
