import { Stack, StackProps } from "aws-cdk-lib"
import { LayerVersion, Function as LambdaFunction, Runtime, Code, Architecture } from "aws-cdk-lib/aws-lambda"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"
import { Construct } from "constructs"

import { developmentEnv, prefix } from "../../constants"

interface Props extends StackProps {
  secret: Secret
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

    const lambda = new LambdaFunction(this, `${prefix}-lambda`, {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 1024,
      handler: "run.sh",
      code: Code.fromAsset(".next/standalone"),
      architecture: Architecture.X86_64,
      layers: [lambdaWebAdapter],
      environment: {
        PORT: "8080",
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
        RUST_LOG: "info",
        PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: "info",
        SECRET_ARN: props.secret.secretArn,
        DEVELOPMENT_ENV: developmentEnv,
      },
      description: `Created at: ${new Date().toISOString()}`,
    })

    props.secret.grantRead(lambda)

    this.lambda = lambda
  }
}
