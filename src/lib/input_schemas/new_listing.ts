import { z } from "zod";
import { parseToDinero } from "@/lib/utils";
import { INR } from "@dinero.js/currencies";
import { dinero, greaterThan } from "dinero.js";
const maxPriceDinero = dinero({ amount: 9999999, currency: INR });

export default function getSchema() {
  const formSchema = z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(50, "Title can be a maximum of 50 characters")
      .refine((arg) => !arg.includes("\n"), "Title cannot contain newlines"),
    shortDescription: z
      .string()
      .trim()
      .min(1, "Short description cannot be empty")
      .max(100, "Short description can be a maximum of 100 characters")
      .refine(
        (arg) => !arg.includes("\n"),
        "Short description cannot contain newlines"
      ),
    longDescription: z
      .string()
      .trim()
      .max(500, "Long description can be a maximum of 500 characters")
      .optional(),
    startingPrice: z
      .string()
      .trim()
      .min(1, "Field is required")
      .superRefine((val, ctx) => {
        const parsed = parseToDinero(val);
        if (!parsed)
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount must be a valid number",
          });
        if (greaterThan(parsed, maxPriceDinero))
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Starting price too high",
          });
      }),
    media: z
      .array(z.number())
      .min(1, "Upload at least one image")
      .max(3, "Max 3 images"),
    endDate: z
      .date({ required_error: "Specify auction end date" })
      .min(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000))
      .max(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  });
  return formSchema;
}

export type schemaType = z.infer<ReturnType<typeof getSchema>>;
