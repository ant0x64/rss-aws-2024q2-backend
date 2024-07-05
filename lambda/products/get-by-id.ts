import { APIGatewayProxyHandler } from "aws-lambda";

import productService from '~/services/repositories/product';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const product = await productService.getById(event.pathParameters?.id || "");
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };
  
  if (!product) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Product not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(product),
  };
};
