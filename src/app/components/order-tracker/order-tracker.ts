import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { Order } from '../../../models/order.model';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-order-tracker',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-tracker.html',
  styleUrl: './order-tracker.css'
})
export class OrderTracker implements OnInit {
  orders: Order[] = [];
  products: Map<number, Product> = new Map();
  loading = true;
  error: string | null = null;
  filter: 'ALL' | 'IN' | 'OUT' = 'ALL';
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED' = 'ALL';

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        products.forEach(p => this.products.set(p.id, p));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const typeMatch = this.filter === 'ALL' || order.type === this.filter;
      const statusMatch = this.statusFilter === 'ALL' || order.status === this.statusFilter;
      return typeMatch && statusMatch;
    });
  }

  getProductName(productId: number): string {
    return this.products.get(productId)?.name || `Product #${productId}`;
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          this.error = 'Failed to delete order';
          console.error(err);
        }
      });
    }
  }

  getTotalInflow(): number {
    return this.filteredOrders
      .filter(o => o.type === 'IN' && o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.quantity, 0);
  }

  getTotalOutflow(): number {
    return this.filteredOrders
      .filter(o => o.type === 'OUT' && o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.quantity, 0);
  }

  getPendingCount(): number {
    return this.filteredOrders.filter(o => o.status === 'PENDING').length;
  }
}
