import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

import { getSecret } from "@/utils/lambda-utils"

if (process.env.DEVELOPMENT_ENV === "prod") {
  /** @type {{ NEXTAUTH_SECRET: string, NEXTAUTH_URL: string, GITHUB_ID: string, GITHUB_SECRET: string }} */
  const secret = await getSecret()
  process.env.NEXTAUTH_SECRET = secret.NEXTAUTH_SECRET
  process.env.NEXTAUTH_URL = secret.NEXTAUTH_URL
  process.env.GITHUB_ID = secret.GITHUB_ID
  process.env.GITHUB_SECRET = secret.GITHUB_SECRET
}

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    PORT: z
      .string()
      .optional()
      .transform((value) => parseInt(value || 3000)),
    CI: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),

    NEXTAUTH_SECRET: z.string(),

    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    PORT: process.env.PORT,
    CI: process.env.CI,
    ANALYZE: process.env.ANALYZE,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
