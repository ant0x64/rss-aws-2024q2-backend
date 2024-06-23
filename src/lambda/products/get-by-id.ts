import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "~/utils/lambda";

import productService from "~/services/db/product";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  console.log("Received event: ", JSON.stringify(event, null, 2));

  try {
    const product = await productService.getById(
      event.pathParameters?.id || "",
    );

    if (!product) {
      return createResponse(404, { message: "Product not found" });
    }

    return createResponse(200, product);
  } catch (e) {
    console.error(e);
    return createResponse(500, { message: "Internal Error" });
  }
};
