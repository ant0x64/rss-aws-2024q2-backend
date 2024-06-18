import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";

interface ProductInterface {
  id: string;
  title: string;
  description?: string;
  price: number;
}

// const products: ProductInterface[] = [
//   { id: "1", title: "Product 1", description: "Description for product 1", price: 10.99 },
//   { id: "2", title: "Product 2", description: "Description for product 2", price: 20.99 },
//   { id: "3", title: "Product 3", description: "Description for product 3", price: 30.99 },
//   { id: "4", title: "Product 4", description: "Description for product 4", price: 40.99 },
//   { id: "5", title: "Product 5", description: "Description for product 5", price: 50.99 },
//   { id: "6", title: "Product 6", description: "Description for product 6", price: 60.99 },
//   { id: "7", title: "Product 7", description: "Description for product 7", price: 70.99 },
//   { id: "8", title: "Product 8", description: "Description for product 8", price: 80.99 },
//   { id: "9", title: "Product 9", description: "Description for product 9", price: 90.99 },
//   { id: "10", title: "Product 10", description: "Description for product 10", price: 100.99 }
// ];

// const productMap: Map<string, ProductInterface> = new Map(
//   products.map(product => [product.id, product])
// );

const client = new DynamoDBClient();
const dc = DynamoDBDocumentClient.from(client);

class ProductService {
  
  protected defaultParams = {
    TableName: process.env.PRODUCTS_TABLE || ''
  };

  async getList(): Promise<ProductInterface[]> {
    const result = await dc.send(new ScanCommand(this.defaultParams));
    return result.Items as ProductInterface[] || [];
  }

  async getById(id: ProductInterface['id']): Promise<ProductInterface | undefined> {
    const result = await dc.send(new GetCommand({ ...this.defaultParams, Key: { id }}));
    return result.Item as ProductInterface || undefined;
  }

  async putItem(product: ProductInterface): Promise<ProductInterface | false> {
    await dc.send(new PutCommand({...this.defaultParams, Item: { ...product, id: randomBytes(32).toString('hex')}}));
    return product;
  }
}

export default new ProductService;
