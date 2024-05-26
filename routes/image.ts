import express from "express";
import { imagesController, singleImageController,incrementDownloadController } from "../controllers/imageControllers";

const router = express.Router();

router.get("/", imagesController);

router.get("/:id", singleImageController);

router.patch("/:id", incrementDownloadController)

export default router;
