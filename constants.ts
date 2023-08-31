import { z } from "zod"

import { name } from "./package.json"

export const prefix = `${name}-${z
  .enum(["dev", "prod"])
  .optional()
  .transform((value) => value ?? "dev")
  .parse(process.env.DEVELOPMENT_ENV)}`
