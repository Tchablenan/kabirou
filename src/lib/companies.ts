import * as z from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

/** Validation partagée entre le formulaire admin et l'API. */
export const companySchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(120),
  kind: z.enum(["EMPLOYER", "CLIENT"]),
  logoUrl: optionalText(500),
  detailFr: optionalText(120),
  detailEn: optionalText(120),
  period: optionalText(40),
  current: z.boolean().default(false),
  url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => !v || /^https?:\/\//i.test(v), "L'adresse doit commencer par http:// ou https://"),
  visible: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export type CompanyInput = z.infer<typeof companySchema>;

export type Company = CompanyInput & { id: string };
