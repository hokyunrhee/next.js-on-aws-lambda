import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

import { prefix } from "../../constants"

export class BucketStack extends Stack {
  public bucket: Bucket

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, `${prefix}-bucket`, {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    this.bucket = bucket
  }
}
