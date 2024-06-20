import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

import {
  ProductInterface,
  StockInterface,
  ProductStockInterface,
} from "~/types/products";

const client = new DynamoDBClient();
const dc = DynamoDBDocumentClient.from(client);

class ProductService {
  protected defaultParams = {
    ProductsTableName: process.env.PRODUCTS_TABLE || "",
    StocksTableName: process.env.STOCK_TABLE || "",
  };

  async getList(): Promise<ProductStockInterface[]> {
    const { Items: products } = await dc.send(
      new ScanCommand({ TableName: this.defaultParams.ProductsTableName })
    );
    const { Items: stocks } = await dc.send(
      new ScanCommand({ TableName: this.defaultParams.StocksTableName })
    );

    const stocksMap = new Map<StockInterface["product_id"], StockInterface>();
    (stocks as StockInterface[])?.forEach((item) => {
      stocksMap.set(item.product_id, item);
    });

    return (
      (products as ProductInterface[])?.map((product) => {
        return {
          ...product,
          count: stocksMap.get(product.id)?.count || 0,
        };
      }) || []
    );
  }

  async getById(
    id: ProductInterface["id"]
  ): Promise<ProductStockInterface | undefined> {
    const { Item: product } = await dc.send(
      new GetCommand({
        TableName: this.defaultParams.ProductsTableName,
        Key: { id },
      })
    );

    if (!product) {
      return undefined;
    }

    const { Item: stock } = await dc.send(
      new GetCommand({
        TableName: this.defaultParams.StocksTableName,
        Key: { product_id: id },
      })
    );

    return { ...(product as ProductInterface), count: stock?.count || 0 };
  }

  async putItem(
    productStock: ProductStockInterface
  ): Promise<ProductInterface | false> {
    const id = randomUUID();

    const product: ProductInterface = { ...productStock, id };
    const stock: StockInterface = { ...productStock, product_id: id };

    const transaction = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: this.defaultParams.ProductsTableName,
            Item: product,
          },
        },
        {
          Put: {
            TableName: this.defaultParams.StocksTableName,
            Item: stock,
          },
        },
      ],
    });

    dc.send(transaction);

    return { ...productStock, id };
  }
}

export default new ProductService();
