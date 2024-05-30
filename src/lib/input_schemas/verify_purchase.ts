import { z } from "zod";

export default function getSchema() {
  const formSchema = z
    .object({
      otp: z.string().trim().length(6, "OTP should be 6 characters long"),
      listingId: z.number(),
    })
    .required({ listingId: true });
  return formSchema;
}

export type schemaType = z.infer<ReturnType<typeof getSchema>>;
