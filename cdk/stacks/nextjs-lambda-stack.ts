import { Stack, StackProps } from 'aws-cdk-lib';
import { LayerVersion, Function as LambdaFunction, Runtime, Code, Architecture } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path'

export class NextjsLambdaStack extends Stack {
    public lambda: LambdaFunction;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const lambdaAdapterLayer = LayerVersion.fromLayerVersionArn(this, 'LambdaAdapterLayerX86',
            `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerX86:17`
        )

        const nextjsLambda = new LambdaFunction(this, 'NextjsLambda', {
            runtime: Runtime.NODEJS_16_X,
            memorySize: 512,
            handler: 'run.sh',
            code: Code.fromAsset(path.join(__dirname, '../../nextjs-app/.next/standalone')),
            architecture: Architecture.X86_64,
            layers: [lambdaAdapterLayer],
            environment: {
                PORT: '8080',
                AWS_LAMBDA_EXEC_WRAPPER: '/opt/bootstrap',
                RUST_LOG: 'info'
            },
            description: `Created at: ${new Date().toISOString()}`
        })

        this.lambda = nextjsLambda
    }
}
