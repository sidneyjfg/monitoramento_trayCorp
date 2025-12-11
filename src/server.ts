// src/server.ts
import { app } from "./app";
import { validateAndCreateTables } from "./config/dbConfig";
import { startProductCron } from "./modules/products/product.cron";
import { ProductService } from "./modules/products/product.service";

const port = Number(process.env.PORT || 3000);

async function start() {
  await validateAndCreateTables();
  // 🔥 inicia o cron de sync de produtos
  startProductCron();

  app.listen(port, () => {
    console.log(`🚀 Server rodando na porta ${port}`);
  });
}

start();
