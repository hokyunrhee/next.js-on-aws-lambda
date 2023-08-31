import { name } from "../package.json"
import { env } from "@/env.mjs"

export const prefix = `${name}-${env.DEVELOPMENT_ENV}`
