import { config } from "dotenv"
import { z } from "zod"

import { name as NAME } from "../package.json"

config({ path: ".env.local" })

const name = NAME.split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("")

const developmentEnv = z
  .enum(["STAGING", "PRODUCTION"])
  .optional()
  .transform((value) => value ?? "STAGING")
  .transform((value) => value.charAt(0) + value.slice(1).toLowerCase())
  .parse(process.env.DEVELOPMENT_ENV)

export const prefix = `${name}${developmentEnv}`
