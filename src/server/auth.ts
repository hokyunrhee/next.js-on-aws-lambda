import { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { env } from "@/env.mjs"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
} satisfies AuthOptions
