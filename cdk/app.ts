#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NextjsLambdaStack } from './stacks/nextjs-lambda-stack';
import { ApiStack } from './stacks/api-stack';
import { NextjsBucketStack } from './stacks/nextjs-bucket-stack';
import { BucketDeploymentStack } from './stacks/bucket-deployment-stack';
import { CloudfrontStack } from './stacks/cloudfront-stack';


const app = new cdk.App();

const nextjsLambdaStack = new NextjsLambdaStack(app, 'NextjsLambdaStack',);
const apiStack = new ApiStack(app, 'ApiStack', { lambda: nextjsLambdaStack.lambda })
const nextjsBucketStack = new NextjsBucketStack(app, 'NextjsBucketStack')

new CloudfrontStack(app, 'CloudfrontStack', { restApi: apiStack.restApi, bucket: nextjsBucketStack.bucket })
new BucketDeploymentStack(app, 'BucketDeploymentStack', { destinationBucket: nextjsBucketStack.bucket })