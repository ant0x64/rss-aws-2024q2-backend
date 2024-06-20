import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "~/utils/lambda";

import productService from '~/services/db/product';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    return createResponse(200, await productService.getList());
  } catch {
    return createResponse(500, {'message': 'Internal Error'});
  }
};