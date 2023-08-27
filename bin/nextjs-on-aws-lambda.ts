#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NextjsLambdaStack } from '../lib/nextjs-lambda-stack';
import { ApiStack } from '../lib/api-stack';
import { NextjsBucketStack } from '../lib/nextjs-bucket-stack';
import { BucketDeploymentStack } from '../lib/bucket-deployment-stack';


const app = new cdk.App();

const nextjsLambdaStack = new NextjsLambdaStack(app, 'NextjsLambdaStack',);
new ApiStack(app, 'ApiStack', { lambda: nextjsLambdaStack.lambda })

const nextjsBucketStack = new NextjsBucketStack(app, 'NextjsBucketStack')
new BucketDeploymentStack(app, 'BucketDeploymentStack', { destinationBucket: nextjsBucketStack.bucket })