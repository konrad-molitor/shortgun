import { NextFunction, Request, Response } from "express";
import jwtVerifyPromise from "../helpers/jwtVerifyPromise";
import User from "../models/User";

interface IRequest extends Request {
  user?: any;
  error?: any;
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.get("X-Auth")) {
    const authHeader = req.get("X-Auth") || " ";
    // @ts-ignore: Object is possibly 'null'
    if (authHeader.split(" ")[0] === "Bearer:") {
        try {
          const user = await jwtVerifyPromise(authHeader.split(" ")[1]);
          const foundUser = await User.findById(user.id);
          if (foundUser) {
            const request = req as IRequest;
            request.user = {email: foundUser.email, id: foundUser.id};
          } else {
            // If no user with such id
            const request = req as IRequest;
            request.error = {
              message: "No such user.",
              status: 401,
            };
          }
        } catch (e) {
          const request = req as IRequest;
          request.error = e;
        }
      } else {
        // if bearer is not present
        const request = req as IRequest;
        request.error = {
          message: "Incorrect request headers.",
          status: 400,
        };
      }
  } else {
    const request = req as IRequest;
    request.error = {
      message: "Authorization required.",
      status: 401,
    };
  }
  next();
};

export { auth, IRequest };
