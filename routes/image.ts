import express from "express";
import { imagesController, singleImageController } from "../controllers/image";

const router = express.Router();

router.get("/", imagesController);

router.get("/:id", singleImageController);

export default router;
