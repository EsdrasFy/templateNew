import { Request, Response } from "express";
export default {
  async read(req:Request, res:Response) {
    res
      .status(200)
      .json({
        status: 200,
        msg: "Bem vindo a API da URBAN VOGUE, a loja com o estilo das ruas!",
      });
  },
};
