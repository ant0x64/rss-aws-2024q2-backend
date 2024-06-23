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
        handler: "products-file.importProductsFile",
        environment: {
          BUCKET_IMPORT_NAME: bucket.bucketName,
          BUCKET_IMPORT_UPLOADED_NAME: "uploaded",
        },
      },
    );

    //bucket.grantPut(lambdaImport);
    lambdaImport.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:Put*", "s3:Get*"],
        resources: [bucket.bucketArn + "/uploaded/*"],
      }),
    );

    // API
    const api = new apigateway.RestApi(this, "Api-Import", {
      restApiName: "Import Service",
    });
    const importResource = api.root.addResource("import");

    importResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaImport),
      {
        requestParameters: {
          "method.request.querystring.name": true,
        },
      },
    );
  }
}
