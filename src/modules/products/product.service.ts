// src/modules/products/product.service.ts
import { fetchTrayProducts } from "../../clients/trayClient";
import { getMonitoramentoConnection } from "../../config/dbConfig";
import { ProductRepository } from "./product.repository";
import { trayProductSchema, tempProductSchema, TempProduct } from "./product.schemas";

export class ProductService {
  private repository = new ProductRepository();

  async syncTrayProductsToTemp() {
    const rawProducts = await fetchTrayProducts();

    const valid: TempProduct[] = [];
    let invalid = 0;

    for (const raw of rawProducts) {
      const parsed = trayProductSchema.safeParse(raw);

      if (!parsed.success) {
        invalid++;
        continue;
      }

      const prd = parsed.data;

      const temp = tempProductSchema.parse({
        ...prd,
        estoque: prd.estoque,
        raw_payload: raw
      });

      valid.push(temp);
    }

    await this.repository.clearTempTable();
    await this.repository.insertManyTemp(valid);

    return {
      inserted: valid.length,
      invalid
    };
  }

  
}

export const clearTempOrders = async () => {
  const connection = await getMonitoramentoConnection();

  try {
    await connection.query('TRUNCATE TABLE temp_products');
    console.log('Tabela temp_products limpa com sucesso.');
  } catch (error: unknown) {
    console.error('Erro ao limpar a tabela temp_orders:', error);
    throw error;
  } finally {
    connection.release();
  }
};