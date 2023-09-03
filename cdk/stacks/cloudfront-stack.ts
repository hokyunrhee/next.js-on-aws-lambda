import { Stack, StackProps } from "aws-cdk-lib"
import { RestApi } from "aws-cdk-lib/aws-apigateway"
import { Certificate } from "aws-cdk-lib/aws-certificatemanager"
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestCookieBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins"
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

import { prefix } from "../constants"

interface Props extends StackProps {
  domainName: string
  subdomainName?: string
  hostedZoneId: string
  certificateArn: string
  restApi: RestApi
  bucket: Bucket
}

export class CloudfrontStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const certificate = Certificate.fromCertificateArn(this, `${prefix}CustomDomainCertificate`, props.certificateArn)

    const originRequestPolicy = new OriginRequestPolicy(this, `${prefix}OriginRequestPolicy`, {
      cookieBehavior: OriginRequestCookieBehavior.all(),
      queryStringBehavior: OriginRequestQueryStringBehavior.all(),
    })

    const distribution = new Distribution(this, `${prefix}Distribution`, {
      certificate: certificate,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      domainNames: [!props.subdomainName ? props.domainName : `${props.subdomainName}.${props.domainName}`],
      defaultBehavior: {
        origin: new RestApiOrigin(props.restApi),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        originRequestPolicy,
      },
      additionalBehaviors: {
        "_next/static/*": {
          origin: new S3Origin(props.bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        },
        "static/*": {
          origin: new S3Origin(props.bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        },
      },
    })

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${prefix}Hostedzone`, {
      zoneName: props.domainName,
      hostedZoneId: props.hostedZoneId,
    })

    new ARecord(this, `${prefix}ARecord`, {
      recordName: !props.subdomainName ? props.domainName : `${props.subdomainName}.${props.domainName}`,
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    })
  }
}
