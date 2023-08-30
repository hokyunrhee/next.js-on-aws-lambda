import { Stack, StackProps } from "aws-cdk-lib"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from "constructs"

interface Props extends StackProps {
  destinationBucket: Bucket
}

export class BucketDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    new BucketDeployment(this, "NextjsStaticDeployment", {
      sources: [Source.asset(".next/static/")],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix: "_next/static",
    })

    new BucketDeployment(this, "NextjsPublicDeployment", {
      sources: [Source.asset("public/static/")],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix: "static",
    })
  }
}
