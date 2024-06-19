import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";

import { ProductInterface } from "~/types/products";

const client = new DynamoDBClient();
const dc = DynamoDBDocumentClient.from(client);

class ProductService {
  protected defaultParams = {
    TableName: process.env.PRODUCTS_TABLE || '',
  };

  async getList(): Promise<ProductInterface[]> {
    const result = await dc.send(new ScanCommand(this.defaultParams));
    return (result.Items as ProductInterface[]) || [];
  }

  async getById(
    id: ProductInterface['id']
  ): Promise<ProductInterface | undefined> {
    const result = await dc.send(
      new GetCommand({ ...this.defaultParams, Key: { id } })
    );
    return (result.Item as ProductInterface) || undefined;
  }

  async putItem(product: ProductInterface): Promise<ProductInterface | false> {
    const productModel = { ...product, id: randomBytes(32).toString("hex") };
    await dc.send(
      new PutCommand({
        ...this.defaultParams,
        Item: productModel,
      })
    );
    return productModel;
  }
}

export default new ProductService();
