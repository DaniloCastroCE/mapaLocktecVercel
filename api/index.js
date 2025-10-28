import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { home } from "../controller/router.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", home);

export default router;
