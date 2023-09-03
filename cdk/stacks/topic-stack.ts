import { Stack, StackProps } from "aws-cdk-lib"
import { Topic } from "aws-cdk-lib/aws-sns"
import { Construct } from "constructs"

import { prefix } from "../constants"

export class TopicStack extends Stack {
  public topic: Topic

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const topic = new Topic(this, `${prefix}Topic`)

    this.topic = topic
  }
}
