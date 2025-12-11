// src/modules/products/product.cron.ts
import cron from "node-cron";
import { ProductService } from "./product.service";
import { config } from "../../config";
import { logger } from "../../utils/logger";

export const startProductCron = () => {
  const cronSchedule = config.CRON_SCHEDULE;
  const service = new ProductService();

  cron.schedule(
    cronSchedule,
    async () => {
      const start = Date.now();

      logger?.info?.("🔄 [CRON-PRODUTOS] Iniciando sincronização de produtos...");

      try {
        const result = await service.syncTrayProductsToTemp();

        const duration = ((Date.now() - start) / 1000).toFixed(2);

        logger?.info?.({
          event: "CRON_PRODUTOS_FINALIZADO",
          message: "✔️ Sincronização concluída com sucesso.",
          inserted: result.inserted,
          invalid: result.invalid,
          duration_seconds: duration,
          timestamp: new Date().toISOString(),
        });

      } catch (error: any) {
        const duration = ((Date.now() - start) / 1000).toFixed(2);

        logger?.error?.({
          event: "CRON_PRODUTOS_ERRO",
          message: "❌ Erro ao executar sincronização de produtos.",
          error_message: error?.message || String(error),
          stack: error?.stack,
          duration_seconds: duration,
          timestamp: new Date().toISOString(),
        });
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );

  logger?.info?.({
    event: "CRON_PRODUTOS_AGENDADO",
    message: `🔁 Cron de produtos agendado.`,
    schedule: cronSchedule,
    timezone: "America/Sao_Paulo",
    timestamp: new Date().toISOString(),
  });
};
