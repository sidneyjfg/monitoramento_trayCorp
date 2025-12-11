// src/modules/products/product.cron.ts
import cron from "node-cron";
import { ProductService } from "./product.service";
import { config } from "../../config";
import { logger } from "../../utils/logger"; // opcional, caso você use logger

export const startProductCron = () => {
  const cronSchedule = config.CRON_SCHEDULE;
  const service = new ProductService();

  cron.schedule(
    cronSchedule,
    async () => {
      try {
        logger?.info?.("⏳ Iniciando sincronização de produtos via cron...");

        const result = await service.syncTrayProductsToTemp();

        logger?.info?.(`✔️ Sincronização concluída. Produtos inseridos: ${result.inserted}, inválidos: ${result.invalid}`);
      } catch (error: any) {
        const msg = error?.message || error;
        logger?.error?.("❌ Erro ao executar sincronização de produtos:", msg);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );

  logger?.info?.(
    `🔁 Cron job de produtos agendado: ${cronSchedule} (timezone: America/Sao_Paulo)`
  );
};
