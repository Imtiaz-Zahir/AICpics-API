import express from "express";
import { getImage } from "../controllers/mediaControllers";

const router = express.Router();

// router.get("/", imagesController);

router.get("/:slug", getImage);

// router.patch("/:id", incrementDownloadController)

export default router;
