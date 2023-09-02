import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { LoggingLevel, SlackChannelConfiguration } from "aws-cdk-lib/aws-chatbot"
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch"
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions"
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { Topic } from "aws-cdk-lib/aws-sns"
import { Construct } from "constructs"

import { prefix } from "../../constants"

interface Props extends StackProps {
  restApiName: string
}

export class AlarmStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const topic = new Topic(this, `${prefix}-sns-topic`)
    const snsAction = new SnsAction(topic)

    const $400Alarm = new Alarm(this, `${prefix}-4xx-alarm`, {
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
      alarmName: `${prefix}-4xx-alarm`,
    })
    $400Alarm.applyRemovalPolicy(RemovalPolicy.DESTROY)

    $400Alarm.addAlarmAction(snsAction)

    const chatbotRole = new Role(this, `${prefix}-chatbot-role`, {
      assumedBy: new ServicePrincipal("chatbot.amazonaws.com"),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsReadOnlyAccess")],
    })
    chatbotRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["cloudwatch:Describe*", "cloudwatch:Get*", "cloudwatch:List*"],
      })
    )

    const chatbot = new SlackChannelConfiguration(this, `${prefix}-chatbot`, {
      slackChannelConfigurationName: `${prefix}-alarm`,
      slackWorkspaceId: "T05QMB4250D",
      slackChannelId: "C05QSN0V4QL",
      notificationTopics: [topic],
      guardrailPolicies: [ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsReadOnlyAccess")],
      role: chatbotRole,
      loggingLevel: LoggingLevel.INFO,
      logRetention: RetentionDays.ONE_WEEK,
    })
    chatbot.applyRemovalPolicy(RemovalPolicy.DESTROY)
  }
}
