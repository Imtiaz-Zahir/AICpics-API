import express from "express";
import { getImage, downloadImage } from "../controllers/mediaControllers";

const router = express.Router();

// router.get("/", imagesController);

router.get("/:slug", getImage);

router.get("/download/:id", downloadImage);

// router.patch("/:id", incrementDownloadController)

export default router;
