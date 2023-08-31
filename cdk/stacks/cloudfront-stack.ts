import { Stack, StackProps } from "aws-cdk-lib"
import { RestApi } from "aws-cdk-lib/aws-apigateway"
import { CachePolicy, Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront"
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

import { prefix } from "../../constants"

interface Props extends StackProps {
  restApi: RestApi
  bucket: Bucket
}

export class CloudfrontStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    new Distribution(this, `${prefix}-distribution`, {
      defaultBehavior: {
        origin: new RestApiOrigin(props.restApi),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_DISABLED,
      },
      additionalBehaviors: {
        "_next/static/*": {
          origin: new S3Origin(props.bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        },
        "static/*": {
          origin: new S3Origin(props.bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        },
      },
    })
  }
}
