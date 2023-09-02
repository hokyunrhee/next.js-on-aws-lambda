import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

import { env } from "@/env.mjs"

type Secret = {
  NEXTAUTH_SECRET: typeof env.NEXTAUTH_SECRET
  NEXTAUTH_URL: typeof env.NEXTAUTH_URL
  GITHUB_ID: typeof env.GITHUB_ID
  GITHUB_SECRET: typeof env.GITHUB_SECRET
}

export const init = async () => {
  const secret = await getSecret<Secret>()

  process.env.NEXTAUTH_SECRET = secret.NEXTAUTH_SECRET
  process.env.NEXTAUTH_URL = secret.NEXTAUTH_URL
  process.env.GITHUB_ID = secret.GITHUB_ID
  process.env.GITHUB_SECRET = secret.GITHUB_SECRET
}

const getSecret = async <T extends string | Record<string, unknown>>() => {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      sessionToken: process.env.AWS_SESSION_TOKEN as string,
    },
  })
  const input = {
    SecretId: process.env.SECRET_ARN,
  }
  const command = new GetSecretValueCommand(input)
  const response = await client.send(command)
  const secret = response.SecretString

  try {
    return JSON.parse(secret as string) as T
  } catch (error) {
    return secret as T
  }
}
