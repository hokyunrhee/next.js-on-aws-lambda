import { Stack, StackProps } from 'aws-cdk-lib';
import { CachePolicy, Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Bucket } from 'aws-cdk-lib/aws-s3';

interface Props extends StackProps {
    restApi: RestApi
    bucket: Bucket
}

export class CloudfrontStack extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        new Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: new RestApiOrigin(props.restApi),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: CachePolicy.CACHING_DISABLED
            },
            additionalBehaviors: {
                '_next/static/*': {
                    origin: new S3Origin(props.bucket),
                    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY
                },
                'static/*': {
                    origin: new S3Origin(props.bucket),
                    viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY
                }
            },
        })
    }
}
