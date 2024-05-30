import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { media } from "@/server/db/schema";
import { ratelimit } from "@/server/ratelimit";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const middleware = async () => {
  // This code runs on your server before upload
  const user = await getServerAuthSession();
  // If you throw, the user will not be able to upload
  if (!user) throw new UploadThingError("Unauthorized");
  const limited = await ratelimit.uploadthing.limit(user.user.id);
  if (!limited.success)
    throw new UploadThingError(
      `Please wait ${Math.ceil((limited.reset - Date.now()) / 1000)} seconds before uploading`
    );
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: user.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const uploadthingRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mediaUploader: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      if (process.env.NODE_ENV !== "production") {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
      }
      const inserted = await db
        .insert(media)
        .values({ url: file.url, userId: metadata.userId })
        .returning();
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        mediaId: inserted.length ? inserted[0].mediaId : undefined,
      };
    }),
} satisfies FileRouter;

export type UploadthingRouter = typeof uploadthingRouter;
