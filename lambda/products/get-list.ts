import { APIGatewayProxyHandler } from "aws-lambda";

import productService from '~/services/repositories/product';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(await productService.getList()),
  };
};
