import { Router } from "express";
import { auth } from "../middleware/auth";
import errorHandler from "../middleware/errorHandler";
import addShortcut from "./addShortcut";
import deleteShortcut from "./deleteShortcut";
import loginUser from "./login";
import getProfile from "./profile";
import shortcutRedirect from "./shortcutRedirect";
import signup from "./signup";
import saveMessage from "./messages";

const router = Router();

router.use(errorHandler);

router.get("/a/profile", auth, (req, res) => getProfile(req, res));

router.post("/a/add", auth, (req, res) => addShortcut(req, res));

router.delete("/a/item/:id", auth, (req, res) => deleteShortcut(req, res));

router.get("/s/:shortcut", (req, res) => shortcutRedirect(req, res));

router.post("/a/signup", (req, res) => signup(req, res));

router.post("/a/login", (req, res) => loginUser(req, res));

router.post("/a/message", (req, res) => saveMessage(req, res));

export default router;
