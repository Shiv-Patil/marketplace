import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { media } from "@/server/db/schema";
import { ratelimit } from "@/server/ratelimit";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const middleware = async () => {
  const user = await getServerAuthSession();
  if (!user) throw new UploadThingError("Unauthorized");
  const limited = await ratelimit.uploadthing.limit(user.user.id);
  if (!limited.success)
    throw new UploadThingError(
      `Please wait ${Math.ceil((limited.reset - Date.now()) / 1000)} seconds before uploading`
    );
  return { userId: user.user.id };
};

export const uploadthingRouter = {
  mediaUploader: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  })
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => {
      const inserted = await db
        .insert(media)
        .values({ url: file.url, userId: metadata.userId })
        .returning();
      return {
        uploadedBy: metadata.userId,
        mediaId: inserted.length ? inserted[0].mediaId : undefined,
      };
    }),
} satisfies FileRouter;

export type UploadthingRouter = typeof uploadthingRouter;
