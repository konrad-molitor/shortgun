import { NextFunction, Request, Response } from "express";
import { IRequest } from "./auth";

const errorHandler = async (req: IRequest, res: Response, next: NextFunction): Promise <void> => {
  if (req.error) {
    res.status(req.error.status).send(req.error.message);
  } else {
    next();
  }
};

export default errorHandler;
