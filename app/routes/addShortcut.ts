import { Response } from "express";
import puppeteer from "puppeteer";
import sharp from "sharp";
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
        res.json(saved);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on("load", (e) => {
          const createPreview = async (screenshotPage: any, shortcutId: string) => {
            const screenshotBuffer = await screenshotPage.screenshot({type: "jpeg", quality: 90, encoding: "binary"});
            await sharp(screenshotBuffer)
              .resize(400)
              .toFile(`${process.env.THUMBNAILS_PATH}/${shortcutId}.jpg`);
            await Shortcut.findByIdAndUpdate(saved.id, {preview: `${shortcutId}.jpg`}, {new: true});
          };
          createPreview(page, saved.id);
        });
        await page.setViewport({width: 1280, height: 720});
        await page.goto(saved.longUrl);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  } else {
    res.send(401);
  }
};

export default addShortcut;
