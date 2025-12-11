import { z } from "zod";

export const trayProductSchema = z.object({
  produtoVarianteId: z.number(),
  produtoId: z.number(),

  idPaiExterno: z
    .union([z.string(), z.number(), z.null()])
    .transform(v => v === null || v === "" ? null : Number(v)),

  sku: z.string(),
  nome: z.string(),
  nomeProdutoPai: z.string().nullable(),

  precoCusto: z.number().nullable(),
  precoDe: z.number().nullable(),
  precoPor: z.number().nullable(),

  ean: z.string().nullable(),

  estoque: z.array(z.any()),

  dataCriacao: z.string(),
  dataAtualizacao: z.string(),

  parentId: z.union([z.number(), z.string(), z.null()]).transform(v => v ? Number(v) : null),
});


export const tempProductSchema = z.object({
  produtoVarianteId: z.number(),
  produtoId: z.number(),
  idPaiExterno: z.number().nullable(),
  sku: z.string(),
  nome: z.string(),
  nomeProdutoPai: z.string().nullable(),

  precoCusto: z.number().nullable(),
  precoDe: z.number().nullable(),
  precoPor: z.number().nullable(),

  ean: z.string().nullable(),

  estoque: z.any(),

  dataCriacao: z.string(),
  dataAtualizacao: z.string(),

  parentId: z.number().nullable(),

  raw_payload: z.unknown()
});

export type TempProduct = z.infer<typeof tempProductSchema>;
