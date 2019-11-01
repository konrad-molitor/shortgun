import { Response } from "express";
import generateShortUrl from "../helpers/generateShortUrl";
import { IRequest } from "../middleware/auth";
import Shortcut from "../models/Shortcut";
import User from "../models/User";

const addShortcut = async (req: IRequest, res: Response) => {
  if (req.user) {
    if (req.body.longUrl) {
      try {
        const shortcut = new Shortcut({
          author: req.user.id,
          longUrl: req.body.longUrl,
          shortUrl: "short",
        });
        let short = generateShortUrl(shortcut._id);
        let unique = false;
        while (!unique) {
          const foundShortcut = await Shortcut.findOne({shortUrl: short});
          if (!foundShortcut) {
            unique = true;
          } else {
            short = generateShortUrl(shortcut._id);
          }
        }
        shortcut.shortUrl = short;
        const author = await User.findById(req.user.id);
        const saved = await shortcut.save();
        // @ts-ignore
        await author.addUrl(saved._id);
        res.send(saved);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  } else {
    res.send(401);
  }
};

export default addShortcut;
