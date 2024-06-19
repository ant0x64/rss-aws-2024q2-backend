export interface ProductInterface {
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface StockInterface {
  product_id: ProductInterface['id'];
  count: number;
}

export interface ProductStockInterface extends ProductInterface, Omit<StockInterface, 'product_id'> {}
