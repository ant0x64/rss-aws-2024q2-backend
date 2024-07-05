import { getProductsList } from "~/lambda/products/get-list";
import productService from "~/services/repositories/product";

import { baseEvent, baseContext } from "./utils";

describe("Lambda: getProductsList", () => {
  test("With existed products", async () => {
    const getProductSpy = jest.spyOn(productService, "getList");
    getProductSpy.mockImplementation(async () => ([{
      id: '1',
      price: 10,
      title: "title",
      description: "description",
    }]));

    const response = await getProductsList(
      { ...baseEvent },
      baseContext,
      () => {}
    );

    expect(getProductSpy).toHaveBeenCalled();
    expect(response).toHaveProperty('body');

    if(response?.body) {
      const body = JSON.parse(response?.body)[0];

      expect(body).toHaveProperty('id');
      expect(body.id).toEqual('1');
    }
  });
});
