import express from "express";
import { getMembersByRole } from "../controllers/staffController.js";

const router = express.Router();

router.get("/get-members-by-role/:roleId", getMembersByRole);

export default router;