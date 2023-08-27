import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Function as LambdaFunction, } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface Props extends StackProps {
    lambda: LambdaFunction;
}

export class ApiStack extends Stack {
    public restApi: RestApi

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const restApi = new RestApi(this, 'RestApi', { defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS, allowMethods: Cors.ALL_METHODS } })

        const functionIntegration = new LambdaIntegration(props.lambda)

        restApi.root.addMethod('ANY', functionIntegration);
        restApi.root.addProxy({ defaultIntegration: functionIntegration, anyMethod: true })

        this.restApi = restApi
    }
}
