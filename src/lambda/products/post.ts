import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "~/utils/lambda";

import productService from '~/services/db/product';

export const postProducts: APIGatewayProxyHandler = async (event) => {
  
  try {
    const productData = JSON.parse(event?.body || '');
    const product = await productService.putItem(productData);

    return createResponse(201, product);;
    
  } catch {
    return createResponse(500, {'message': 'Internal Error'});
  }
  
};

