import { getProductsById } from "~/lambda/products/get-by-id";
import productService from "~/services/db/product";

import { baseEvent, baseContext } from "./utils";

describe("Lambda: getProductsById", () => {
  test("with existed product", async () => {
    const product_id = '1';
    const getProductSpy = jest.spyOn(productService, "getById");
    getProductSpy.mockImplementation(async () => ({
      id: product_id,
      price: 10,
      title: "title",
      description: "description",
      count: 1,
    }));

    const response = await getProductsById(
      { ...baseEvent, pathParameters: { id: product_id } },
      baseContext,
      () => {}
    );

    expect(getProductSpy).toHaveBeenCalledWith(product_id);
    expect(response).toHaveProperty('body');

    if(response?.body) {
      const body = JSON.parse(response?.body);

      expect(body).toHaveProperty('id');
      expect(body.id).toEqual(product_id);
    }
  });

  test("with not existed product", async () => {
    const product_id = '1';
    const getProductSpy = jest.spyOn(productService, "getById");
    getProductSpy.mockImplementation(async () => ( undefined ));

    const response = await getProductsById(
      { ...baseEvent, pathParameters: { id: product_id } },
      baseContext,
      () => {}
    );

    expect(response?.statusCode).toEqual(404);
  });
});
