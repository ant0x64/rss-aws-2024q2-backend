import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "~/utils/lambda";

import productService from "~/services/db/product";

export const postProducts: APIGatewayProxyHandler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const productData = event.body ? JSON.parse(event.body) : event;
    const product = await productService.putItem(productData);

    return createResponse(201, product);
  } catch (e) {
    console.log(e);
    return createResponse(500, { message: "Internal Error" });
  }
};
