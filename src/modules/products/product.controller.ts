import { Request, Response } from "express";
import { ProductService } from "./product.service";

const service = new ProductService();

export class ProductController {
  static async sync(req: Request, res: Response) {
    try {
      const data = await service.syncTrayProductsToTemp();
      return res.json({
        message: "Produtos sincronizados com sucesso!",
        ...data
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Erro ao sincronizar produtos",
        error: err.message
      });
    }
  }
  
}
