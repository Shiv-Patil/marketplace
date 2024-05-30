import { createRouteHandler } from "uploadthing/next";

import { uploadthingRouter } from "@/app/api/uploadthing/core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: uploadthingRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
