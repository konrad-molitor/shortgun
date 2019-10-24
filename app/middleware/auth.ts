import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface IRequest extends Request {
  user?: any;
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.get("X-Auth")) {
    const authHeader = req.get("X-Auth") || " ";
    // @ts-ignore: Object is possibly 'null'
    if (authHeader.split(" ")[0] === "Bearer:") {
        const jwtVerifyPromise = (token: string): Promise<any> => {
          return new Promise((resolve, reject) => {
            jwt.verify(token, "supersecret", { algorithms: ["HS256"] }, (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded);
              }
            });
          });
        };
        try {
          const user = await jwtVerifyPromise(authHeader.split(" ")[1]);
          const foundUser = await User.findById(user.id);
          if (foundUser) {
            const request = req as IRequest;
            request.user = {email: foundUser.email, id: foundUser.id};
            next();
          } else {
            throw new Error("No such user.");
          }
        } catch (e) {
          next(e);
        }
      } else {
        res.status(400).send("Incorrect request headers.");
      }
  } else {
    res.status(401).send("Authorization required.");
  }
};

export { auth, IRequest };
