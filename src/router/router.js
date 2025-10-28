import express from "express";
import { home } from "../controller/router.js";

const router = express.Router();

router.get("/", home);

export default router;
