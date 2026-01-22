export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  reorderLevel: number;
  supplierId: number;
  lastUpdated?: string;
  category?: string;
}

export class ProductDetail implements Product {
  id!: number;
  name!: string;
  description?: string;
  price!: number;
  quantity!: number;
  reorderLevel!: number;
  supplierId!: number;
  lastUpdated?: string;
  category?: string;

  constructor(product: Product) {
    Object.assign(this, product);
  }

  isLowStock(): boolean {
    return this.quantity <= this.reorderLevel;
  }

  getStockStatus(): string {
    if (this.quantity === 0) return 'Out of Stock';
    if (this.isLowStock()) return 'Low Stock';
    return 'In Stock';
  }
}
