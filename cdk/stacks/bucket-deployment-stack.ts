import { Stack, StackProps } from "aws-cdk-lib"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from "constructs"

import { prefix } from "../constants"

interface Props extends StackProps {
  destinationBucket: Bucket
}

export class BucketDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    new BucketDeployment(this, `${prefix}StaticDeployment`, {
      sources: [Source.asset(".next/static/")],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix: "_next/static",
    })

    new BucketDeployment(this, `${prefix}PublicDeployment`, {
      sources: [Source.asset("public/static/")],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix: "static",
    })
  }
}
