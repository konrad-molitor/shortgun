import { Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import { IRequest } from "../middleware/auth";
import Shortcut from "../models/Shortcut";
import User from "../models/User";

const deleteShortcut = async (req: IRequest, res: Response) => {
  if (req.user) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid item ID.");
      }
      const shortcut = await Shortcut.findById(req.params.id);
      if (shortcut) {
        const author = await User.findById(shortcut.author);
        if (author) {
          if (mongoose.Types.ObjectId(author._id).equals(mongoose.Types.ObjectId(req.user.id))) {
            // @ts-ignore
            const result = await author.removeUrl(shortcut._id);
            if (result) {
              const removed = await shortcut.remove();
              res.send(removed);
              if (removed.preview) {
                fs.unlink(`${process.env.THUMBNAILS_PATH}/${removed.preview}`, err => {});
              }
            } else {
              res.status(500).send("Server error.");
            }
          } else {
            res.status(401).send("Only shortcut author can delete it.");
          }
        }
      } else {
        res.status(404).send("No such shortcut.");
      }
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    res.status(401).send("Authorization required.");
  }
};

export default deleteShortcut;
