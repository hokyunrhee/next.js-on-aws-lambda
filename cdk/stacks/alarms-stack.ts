import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch"
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions"
import { Topic } from "aws-cdk-lib/aws-sns"
import { Construct } from "constructs"

import { prefix } from "../constants"

interface Props extends StackProps {
  topic: Topic
  restApiName: string
}

export class AlarmsStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const snsAction = new SnsAction(props.topic)

    const $400Alarm = new Alarm(this, `${prefix}4xxAlarm`, {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        period: Duration.minutes(1),
        statistic: "Sum",
        unit: Unit.COUNT,
        dimensionsMap: {
          ApiName: props.restApiName,
        },
      }),
      evaluationPeriods: 1,
      threshold: 5,
    })
    $400Alarm.addAlarmAction(snsAction)
    $400Alarm.applyRemovalPolicy(RemovalPolicy.DESTROY)
  }
}
