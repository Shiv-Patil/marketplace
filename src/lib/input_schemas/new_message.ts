import { z } from "zod";

export default function getSchema() {
  const formSchema = z
    .object({
      content: z
        .string({
          required_error: "Message content cannot be empty",
        })
        .trim()
        .min(1, "Message content cannot be empty")
        .max(
          1000,
          "Message content cannot exceed maximum length of 1000 characters."
        ),
      conversationId: z.number(),
    })
    .required({ content: true, conversationId: true });
  return formSchema;
}

export type schemaType = z.infer<ReturnType<typeof getSchema>>;
