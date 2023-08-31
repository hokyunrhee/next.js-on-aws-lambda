import { Stack, StackProps } from "aws-cdk-lib"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"
import { Construct } from "constructs"

import { prefix } from "../../constants"

export class SecretsManagerStack extends Stack {
  public secretArn: string

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const secret = new Secret(this, `${prefix}-secret`, {
      secretObjectValue: {},
    })

    this.secretArn = secret.secretArn
  }
}
