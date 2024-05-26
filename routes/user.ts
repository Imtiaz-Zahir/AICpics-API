import express from "express";
import { postUsersController,patchUserController,getUserController} from "../controllers/userControllers";

const router = express.Router();

router.post("/", postUsersController);

router.get("/:email", getUserController);

router.patch("/:email", patchUserController);

export default router;
