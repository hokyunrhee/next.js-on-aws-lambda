import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { Rule, Schedule } from "aws-cdk-lib/aws-events"
import * as targets from "aws-cdk-lib/aws-events-targets"
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"

import { prefix } from "../constants"

interface Props extends StackProps {
  lambda: LambdaFunction
}

export class CronStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const eventRule = new Rule(this, `${prefix}ScheduleRule`, {
      schedule: Schedule.expression("rate(5 minutes)"),
    })
    eventRule.addTarget(new targets.LambdaFunction(props.lambda))

    eventRule.applyRemovalPolicy(RemovalPolicy.DESTROY)
  }
}
