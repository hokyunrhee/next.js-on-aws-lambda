import { z } from "zod"

import { name } from "./package.json"

export const developmentEnv = z
  .enum(["dev", "prod"])
  .optional()
  .transform((value) => value ?? "dev")
  .parse(process.env.DEVELOPMENT_ENV)

export const prefix = `${name}-${developmentEnv}`
