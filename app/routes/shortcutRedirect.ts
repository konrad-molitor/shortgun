import { Request, Response } from "express";
import Shortcut from "../models/Shortcut";

const shortcutRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const shortcut = await Shortcut.findOne({shortUrl: req.params.shortcut});
    if (shortcut) {
      res.redirect(shortcut.longUrl);
    } else {
      res.redirect("/");
    }
  } catch (e) {
    res.status(500).redirect("/");
  }
};

export default shortcutRedirect;
