import { Stack, StackProps } from "aws-cdk-lib"
import { LayerVersion, Function as LambdaFunction, Runtime, Code, Architecture } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"

import { prefix } from "../../constants"

interface Props extends StackProps {
  secretArn: string
}

export class LambdaStack extends Stack {
  public lambda: LambdaFunction

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const lambdaWebAdapter = LayerVersion.fromLayerVersionArn(
      this,
      `${prefix}-lambda-web-adapter`,
      `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerX86:17`
    )

    const parametersAndSecretsLambdaExtension = LayerVersion.fromLayerVersionArn(
      this,
      `${prefix}-parameters-and-secrets-lambda-extension`,
      `arn:aws:lambda:${this.region}:738900069198:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4`
    )

    const lambda = new LambdaFunction(this, `${prefix}-lambda`, {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 1024,
      handler: "run.sh",
      code: Code.fromAsset(".next/standalone"),
      architecture: Architecture.X86_64,
      layers: [lambdaWebAdapter, parametersAndSecretsLambdaExtension],
      environment: {
        PORT: "8080",
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
        RUST_LOG: "info",
        SECRET_ARN: props.secretArn,
      },
      description: `Created at: ${new Date().toISOString()}`,
    })

    this.lambda = lambda
  }
}
