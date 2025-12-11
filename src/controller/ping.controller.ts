// src/controllers/ping.controller.ts
import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
  res.status(200).send("Pong");
};
