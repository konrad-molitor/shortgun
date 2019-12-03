import { Router, static as exstatic } from "express";
import serveStatic from "serve-static";
import { auth } from "../middleware/auth";
import errorHandler from "../middleware/errorHandler";
import addShortcut from "./addShortcut";
import deleteShortcut from "./deleteShortcut";
import loginUser from "./login";
import getProfile from "./profile";
import shortcutRedirect from "./shortcutRedirect";
import signup from "./signup";

const router = Router();

router.use(errorHandler);

router.get("/a/profile", auth, (req, res) => getProfile(req, res));

router.post("/a/add", auth, (req, res) => addShortcut(req, res));

router.delete("/a/item/:id", auth, (req, res) => deleteShortcut(req, res));

router.get("/s/:shortcut", (req, res) => shortcutRedirect(req, res));

router.post("/a/signup", (req, res) => signup(req, res));

router.post("/a/login", (req, res) => loginUser(req, res));

// const serve = serveStatic("public", {
//   dotfiles: "ignore",
//   index: ["index.html"],
//   redirect: false,
// });

// router.use((req, res, next) => serve(req, res, next));

router.use("/static", exstatic("public/static", {redirect: false}));
router.use("/", exstatic("public"));

export default router;
