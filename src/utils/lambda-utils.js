/**
 * Returns the secret from AWS Secrets Manager
 * @returns {(string | Object.<string, string>)}
 */
export const getSecret = async () => {
  const port = 2773
  const secretArn = process.env.SECRET_ARN
  const secretsExtensionEndpoint = `http://localhost${port}/secretsmanager/get?secretId=${secretArn}`

  const response = await fetch(secretsExtensionEndpoint, {
    headers: {
      "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to retrieve secret from AWS Secrets Manager")
  }

  const secret = await response.json()

  return secret
}
