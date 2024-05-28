import { getIncrement, parseToDinero } from "@/lib/utils";
import { INR } from "@dinero.js/currencies";
import { add, dinero, equal, lessThan, toDecimal } from "dinero.js";
import { z } from "zod";

export default function getSchema(currentPrice: string) {
  const zeroDinero = dinero({ amount: 0, currency: INR });
  const currentPriceDinero = parseToDinero(currentPrice) || zeroDinero;
  const incrementINR = getIncrement(Number(toDecimal(currentPriceDinero)));
  const incrementDinero = dinero({ amount: incrementINR * 100, currency: INR });
  const minPriceDinero = add(currentPriceDinero, incrementDinero);
  const formSchema = z
    .object({
      bid: z.string().superRefine((val, ctx) => {
        const parsed = parseToDinero(val);
        if (!parsed)
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount must be a valid number",
          });
        if (equal(currentPriceDinero, zeroDinero))
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Cannot place bids at the moment",
          });
        if (lessThan(parsed, minPriceDinero))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Minimum bid amount is ${toDecimal(minPriceDinero)}`,
          });
      }),
      listingId: z.number(),
    })
    .required({ bid: true, listingId: true });
  return { formSchema, minPriceDinero };
}

export type schemaType = z.infer<ReturnType<typeof getSchema>["formSchema"]>;
