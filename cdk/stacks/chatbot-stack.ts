import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { SlackChannelConfiguration, LoggingLevel } from "aws-cdk-lib/aws-chatbot"
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { Topic } from "aws-cdk-lib/aws-sns"
import { Construct } from "constructs"

import { prefix } from "../constants"

interface Props extends StackProps {
  topic: Topic
}

export class ChatbotStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const chatbotRole = new Role(this, `${prefix}ChatbotRole`, {
      assumedBy: new ServicePrincipal("chatbot.amazonaws.com"),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsReadOnlyAccess")],
    })
    chatbotRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["cloudwatch:Describe*", "cloudwatch:Get*", "cloudwatch:List*"],
      })
    )

    const chatbot = new SlackChannelConfiguration(this, `${prefix}Chatbot`, {
      slackChannelConfigurationName: `${prefix}SlackChannelConfiguration`,
      slackWorkspaceId: process.env.SLACK_WORK_SPACE_ID as string,
      slackChannelId: process.env.SLACK_CHANNEL_ID as string,
      notificationTopics: [props.topic],
      guardrailPolicies: [ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsReadOnlyAccess")],
      role: chatbotRole,
      loggingLevel: LoggingLevel.INFO,
      logRetention: RetentionDays.ONE_WEEK,
    })
    chatbot.applyRemovalPolicy(RemovalPolicy.DESTROY)
  }
}
