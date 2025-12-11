import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export type TrayFetchResult = {
  products: any[];
  pages: number;
};

export async function fetchTrayProducts(): Promise<TrayFetchResult> {
  const baseUrl = process.env.TRAY_URL;
  const token = process.env.TRAY_TOKEN;

  if (!baseUrl) {
    throw new Error("TRAY_URL não configurada");
  }

  let page = 1;
  const allProducts: any[] = [];

  while (true) {
    const finalUrl = `${baseUrl.replace(/\/+$/, "")}/produtos?pagina=${page}`;
    console.log(`🔎 Buscando página ${page}: ${finalUrl}`);

    try {
      const response = await axios.get(finalUrl, {
        headers: {
          Authorization: `Basic ${token}`,
          Accept: "application/json",
        },
        timeout: 15000, // evita travar requisição
      });

      const data = response.data;

      // 📌 Caso inesperado: API retornou algo diferente de array
      if (!Array.isArray(data)) {
        console.error(`⚠ Página ${page} retornou formato inesperado. Conteúdo:`, data);
        console.log("🔚 Encerrando paginação pois a API não retornou array.");
        break;
      }

      // 📌 Página vazia → fim da paginação
      if (data.length === 0) {
        console.log(`🔚 Página ${page} retornou array vazio. Encerrando paginação.`);
        break;
      }

      console.log(`📦 Página ${page}: ${data.length} produtos recebidos.`);
      allProducts.push(...data);

      page++;

    } catch (err: any) {
      const status = err.response?.status;
      const body = err.response?.data;

      console.error(`❌ Erro ao buscar página ${page}`);
      console.error(`   → Status: ${status ?? "SEM STATUS"}`);
      console.error(`   → Body:`, body ?? "(sem body)");
      console.error(`   → Mensagem:`, err.message);

      // 📌 Caso comum: página não existe (404)
      if (status === 404) {
        console.log(`🔚 Página ${page} não existe (404). Encerrando paginação.`);
        break;
      }

      // 📌 Se for rate-limit ou erro temporário, podemos quebrar para não travar o cron
      if (status === 429 || status === 503) {
        console.log(`🛑 API limitou ou está indisponível. Interrompendo sincronização.`);
        break;
      }

      // Caso seja outro erro → realmente parar o processamento
      throw new Error(`Erro ao buscar página ${page}: ${err.message}`);
    }
  }

  console.log(`✅ Total de produtos coletados: ${allProducts.length}`);
  const totalPages = page - 1;

  return {
    products: allProducts,
    pages: totalPages,
  };
}
