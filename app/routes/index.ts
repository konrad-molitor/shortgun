import { Router } from "express";
import { auth } from "../middleware/auth";
import addShortcut from "./addShortcut";
import deleteShortcut from "./deleteShortcut";
import loginUser from "./login";
import getProfile from "./profile";
import shortcutRedirect from "./shortcutRedirect";
import signup from "./signup";

const router = Router();

router.get("/a/profile", auth, (req, res) => getProfile);

router.post("/a/add", auth, (req, res) => addShortcut);

router.delete("/a/item/:id", auth, (req, res) => deleteShortcut);

router.get("/:shortcut", (req, res) => shortcutRedirect);

router.post("/a/signup", (req, res) => signup);

router.post("/a/login", (req, res) => loginUser);

export default router;
