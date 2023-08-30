import { Stack, StackProps } from "aws-cdk-lib"
import { LayerVersion, Function as LambdaFunction, Runtime, Code, Architecture } from "aws-cdk-lib/aws-lambda"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"
import { Construct } from "constructs"

export class NextjsLambdaStack extends Stack {
  public lambda: LambdaFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lambdaAdapterLayer = LayerVersion.fromLayerVersionArn(
      this,
      "LambdaAdapterLayerX86",
      `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerX86:17`
    )

    const secrets = Secret.fromSecretNameV2(this, "AppsScrets", "nextjs-on-aws-lambda")

    const nextjsLambda = new LambdaFunction(this, "NextjsLambda", {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: "run.sh",
      code: Code.fromAsset(".next/standalone"),
      architecture: Architecture.X86_64,
      layers: [lambdaAdapterLayer],
      environment: {
        PORT: "8080",
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
        RUST_LOG: "info",
        NEXTAUTH_SECRET: secrets.secretValueFromJson("NEXTAUTH_SECRET").unsafeUnwrap(),
        NEXTAUTH_URL: secrets.secretValueFromJson("NEXTAUTH_URL").unsafeUnwrap(),
        GITHUB_ID: secrets.secretValueFromJson("GITHUB_ID").unsafeUnwrap(),
        GITHUB_SECRET: secrets.secretValueFromJson("GITHUB_SECRET").unsafeUnwrap(),
      },
      description: `Created at: ${new Date().toISOString()}`,
    })

    this.lambda = nextjsLambda
  }
}
