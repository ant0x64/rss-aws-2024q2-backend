export interface ProductInterface {
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface StockInterface {
  product_id: ProductInterface["id"];
  count: number;
}

export interface ProductStockInterface
  extends ProductInterface,
    Omit<StockInterface, "product_id"> {}

export class Product implements ProductInterface {
  title: string;
  description?: string;
  price: number;
  id: string;
}

export class ProductStock implements StockInterface {
  product_id: ProductInterface["id"];
  count: number;
}
