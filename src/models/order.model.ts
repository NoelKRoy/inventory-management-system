export interface Order {
  id: number;
  productId: number;
  quantity: number;
  orderDate: string;
  type: 'IN' | 'OUT';
  supplierId?: number;
  notes?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export class OrderDetail implements Order {
  id!: number;
  productId!: number;
  quantity!: number;
  orderDate!: string;
  type!: 'IN' | 'OUT';
  supplierId?: number;
  notes?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  constructor(order: Order) {
    Object.assign(this, order);
  }

  getOrderTypeLabel(): string {
    return this.type === 'IN' ? 'Stock In' : 'Stock Out';
  }

  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }
}
