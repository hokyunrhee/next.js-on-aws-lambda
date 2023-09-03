import * as cdk from "aws-cdk-lib"

import { prefix } from "./constants"
import { AlarmsStack } from "./stacks/alarms-stack"
import { BucketDeploymentStack } from "./stacks/bucket-deployment-stack"
import { BucketStack } from "./stacks/bucket-stack"
import { ChatbotStack } from "./stacks/chatbot-stack"
import { CloudfrontStack } from "./stacks/cloudfront-stack"
import { LambdaStack } from "./stacks/lambda-stack"
import { RestApiStack } from "./stacks/rest-api-stack"
import { SecretStack } from "./stacks/secret-stack"
import { TopicStack } from "./stacks/topic-stack"

const app = new cdk.App()

// Application
const secretStack = new SecretStack(app, `${prefix}SecretStack`)
const lambdaStack = new LambdaStack(app, `${prefix}LambdaStack`, { secret: secretStack.secret })
const restApiStack = new RestApiStack(app, `${prefix}RestApiStack`, { lambda: lambdaStack.lambda })
const bucketStack = new BucketStack(app, `${prefix}BucketStack`)
new BucketDeploymentStack(app, `${prefix}BucketDeploymentStack`, { destinationBucket: bucketStack.bucket })

// CDN
new CloudfrontStack(app, `${prefix}CloudfrontStack`, {
  domainName: process.env.DOMAIN_NAME as string,
  subdomainName: process.env.SUBDOMAIN_NAME,
  hostedZoneId: process.env.HOSTED_ZONE_ID as string,
  certificateArn: process.env.CERTIFICATE_ARN as string,
  restApi: restApiStack.restApi,
  bucket: bucketStack.bucket,
})

// Slack Notification
const topicStack = new TopicStack(app, `${prefix}TopicStack`)
new ChatbotStack(app, `${prefix}ChatbotStack`, { topic: topicStack.topic })
new AlarmsStack(app, `${prefix}AlarmsStack`, { topic: topicStack.topic, restApiName: restApiStack.restApi.restApiName })
