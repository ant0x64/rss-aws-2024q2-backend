import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export default class ImportStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // BUCKET
    const bucket = new s3.Bucket(this, "Bucket-Import", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // LAMBDA
    const lambdaImport = new lambda.Function(
      this,
      "Lambda-importProductsFile",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/import"),
        handler: "product-file.importProductsFile",
        environment: {
          BUCKET_IMPORT_NAME: bucket.bucketName,
          BUCKET_IMPORT_UPLOADED_NAME: "uploaded",
        },
      }
    );

    lambdaImport.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject"],
        resources: [bucket.bucketArn + "/uploaded/*"],
      })
    );

    // API
    const api = new apigateway.RestApi(this, "Api-Import", {
      restApiName: "Import Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });
    const importResource = api.root.addResource("import");

    importResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaImport),
      {
        requestParameters: {
          name: true,
        },
      }
    );
  }
}
