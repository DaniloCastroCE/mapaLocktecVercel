import express from "express";
import { home } from "../controller/routers/get.js";

const router = express.Router();

router.get("/", home);

export default router;
