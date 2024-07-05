interface ProductInterface {
  id: string;
  title: string;
  description?: string;
  price: number;
}

const products: ProductInterface[] = [
  { id: "1", title: "Product 1", description: "Description for product 1", price: 10.99 },
  { id: "2", title: "Product 2", description: "Description for product 2", price: 20.99 },
  { id: "3", title: "Product 3", description: "Description for product 3", price: 30.99 },
  { id: "4", title: "Product 4", description: "Description for product 4", price: 40.99 },
  { id: "5", title: "Product 5", description: "Description for product 5", price: 50.99 },
  { id: "6", title: "Product 6", description: "Description for product 6", price: 60.99 },
  { id: "7", title: "Product 7", description: "Description for product 7", price: 70.99 },
  { id: "8", title: "Product 8", description: "Description for product 8", price: 80.99 },
  { id: "9", title: "Product 9", description: "Description for product 9", price: 90.99 },
  { id: "10", title: "Product 10", description: "Description for product 10", price: 100.99 }
];

const productMap: Map<string, ProductInterface> = new Map(
  products.map(product => [product.id, product])
);

class ProductService {
  async getList(): Promise<ProductInterface[]> {
    return products;
  }
  async getById(id: ProductInterface['id']): Promise<ProductInterface | undefined> {
    return productMap.get(id);
  }
}

export default new ProductService;
