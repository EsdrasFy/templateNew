// authMiddleware.js
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ msg: "Acesso negado!", status: 401 });
  }

  try {
    const token = bearerToken.split(" ")[1];
    const secret = process.env.SECRET;
    if (secret !== undefined) {
      jwt.verify(token, secret);
      next();
    } else {
      return res.json({ msg: "Erro no segredo" });
    }
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};
export default checkAuthentication;
