import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

import { productStockDto } from "./models/products";

export default class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CREATE TABLES
    const productsTable = new dynamodb.Table(
      this,
      "RSS-Back-Dynamo-ProductsTable",
      {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        tableName: "products",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const stocksTable = new dynamodb.Table(
      this,
      "RSS-Back-Dynamo-StocksTable",
      {
        partitionKey: {
          name: "product_id",
          type: dynamodb.AttributeType.STRING,
        },
        tableName: "stocks",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    // LAMBDAS
    const getProductsLambda = new lambda.Function(
      this,
      "RSS-Back-Lambda-getProductsList",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/products"),
        handler: "get-list.getProductsList",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCK_TABLE: stocksTable.tableName,
        },
      }
    );

    const getProductsByIdLambda = new lambda.Function(
      this,
      "RSS-Back-Lambda-getProductsById",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/products"),
        handler: "get-by-id.getProductsById",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCK_TABLE: stocksTable.tableName,
        },
      }
    );

    const postProductsLambda = new lambda.Function(
      this,
      "RSS-Back-Lambda-postProducts",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("dist/lambda/products"),
        handler: "post.postProducts",
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCK_TABLE: stocksTable.tableName,
        },
      }
    );

    productsTable.grantReadData(getProductsLambda);
    productsTable.grantReadData(getProductsByIdLambda);
    productsTable.grantWriteData(postProductsLambda);
    stocksTable.grantReadData(getProductsLambda);
    stocksTable.grantReadData(getProductsByIdLambda);
    stocksTable.grantWriteData(postProductsLambda);

    // GATEWAY
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

    products.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductsLambda)
    );

    products.addMethod(
      "POST",
      new apigateway.LambdaIntegration(postProductsLambda),
      {
        requestValidator: new apigateway.RequestValidator(
          this,
          "RequestValidator",
          {
            restApi: api,
            validateRequestBody: true,
          }
        ),
        requestModels: {
          "application/json": new apigateway.Model(this, "ProductsModel", {
            restApi: api,
            contentType: "application/json",
            schema: productStockDto,
          }),
        },
      }
    );

    singleProduct.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductsByIdLambda)
    );

    // OUTPUT
    new cdk.CfnOutput(this, "Table-Products-Name", {
      value: productsTable.tableName,
      exportName: "RSS-Back-Table-Products-Name",
    });

    new cdk.CfnOutput(this, "RSS-Back-API-URL", {
      value: api.url,
    });
  }
}
