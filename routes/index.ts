import express from "express";
import imageRouter from "./image";
import userRoute from "./user";
import mediaRoute from "./media";

const router = express.Router();

router.use("/images", imageRouter);
router.use("/users", userRoute);
router.use("/media", mediaRoute);

export default router;
