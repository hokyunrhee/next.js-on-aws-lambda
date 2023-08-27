#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NextjsLambdaStack } from '../lib/nextjs-lambda-stack';
import { ApiStack } from '../lib/api-stack';


const app = new cdk.App();
const nextjsLambdaStack = new NextjsLambdaStack(app, 'NextjsLambdaStack',);
new ApiStack(app, 'ApiStack', { lambda: nextjsLambdaStack.lambda })