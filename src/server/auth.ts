import { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { env } from "@/env.mjs"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID as string,
      clientSecret: env.GITHUB_SECRET as string,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
} satisfies AuthOptions
