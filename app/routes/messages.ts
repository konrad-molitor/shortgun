import { Response } from "express";
import { IRequest } from "../middleware/auth";
import Message from "../models/Message";

const saveMessage = async (req: IRequest, res: Response): Promise<void> => {
    try {
        const newMessage = new Message({
            email: req.body.email,
            message: req.body.message,
        });
        if (req.user) {
            newMessage.user = req.user.id;
        }
        await newMessage.save();
        res.status(204).send();
    } catch (e) {
        res.status(500);
    }
};

export default saveMessage;
