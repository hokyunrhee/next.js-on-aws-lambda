import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class NextjsBucketStack extends Stack {
    public bucket: Bucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const nextjsBucket = new Bucket(this, 'NextjsBucket', {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        })

        this.bucket = nextjsBucket
    }
}
