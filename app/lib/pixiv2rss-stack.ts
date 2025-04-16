import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { getEnvironment } from '../src/Environment';

export class Pixiv2RssStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const contextEnv = this.node.tryGetContext('environments');
    const env = getEnvironment(contextEnv);

    const parameter = ssm.StringParameter.fromStringParameterName(
      this, 'Parameter', env.get('PIXIV2RSS_PARAMETER_STORE_ID')
    );

    const fun = new nodejs.NodejsFunction(this, 'RssFunction', {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_20_X,
      functionName: `${this.stackName}-RssFunction`,
      entry: 'src/index.ts',
      handler: 'handler',
      bundling: {
        target: 'es2020',
        logLevel: nodejs.LogLevel.INFO,
        minify: true,
        sourceMap: false,
        sourcesContent: false,
        externalModules: ['@aws-sdk/*'],
        preCompilation: true,
      },
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: env.clean(),
    });

    parameter.grantRead(fun);

    new lambda.FunctionUrl(this, 'RssFunctionUrl', {
      function: fun,
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.BUFFERED,
    });
  }
}
