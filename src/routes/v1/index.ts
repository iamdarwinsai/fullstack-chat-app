import express from "express";

import * as user from "../../controllers/user-controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/signUp", user.signUp);
router.post("/login", user.loginUser);
router.post("/generateUrl", auth, user.generateURL);

export default router;
