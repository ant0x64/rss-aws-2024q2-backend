import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsLambda = new lambda.Function(
      this,
      "RSS-Back-Lambda-getProductsList",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/products"),
        handler: "get-list.getProductsList",
      }
    );

    const getProductsByIdLambda = new lambda.Function(
      this,
      "RSS-Back-Lambda-getProductsById",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/products"),
        handler: "get-by-id.getProductsById",
      }
    );

    const api = new apigateway.RestApi(this, "ProductsApi", {
      restApiName: "Products Service",
      description: "This service serves products.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        // allowCredentials: true,
      },
    });

    const products = api.root.addResource("products");
    const singleProduct = products.addResource("{id}");

    const getAllIntegration = new apigateway.LambdaIntegration(
      getProductsLambda
    );
    const getByIdIntegration = new apigateway.LambdaIntegration(
      getProductsByIdLambda
    );

    products.addMethod("GET", getAllIntegration);
    singleProduct.addMethod("GET", getByIdIntegration);

    // const deployment = new apigateway.Deployment(this, "MyDeployment", {
    //   api,
    // });

    // const devStage = new apigateway.Stage(this, "DevStage", {
    //   stageName: "dev",
    //   deployment: deployment,
    //   variables: {
    //     environment: "dev", 
    //   },
    // });

    // api.deploymentStage = devStage;

    new cdk.CfnOutput(this, "RSS-Back-API-URL", {
      value: api.url,
    });
  }
}
