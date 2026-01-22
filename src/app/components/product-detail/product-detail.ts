import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { SupplierService } from '../../../services/supplier.services';
import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  supplier: Supplier | null = null;
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private supplierService: SupplierService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id') || '0');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loadSupplier(data.supplierId);
        this.loadOrders(id);
      },
      error: (err) => {
        this.error = 'Failed to load product';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadSupplier(supplierId: number): void {
    this.supplierService.getById(supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
      },
      error: (err) => console.error('Error loading supplier:', err)
    });
  }

  loadOrders(productId: number): void {
    this.orderService.getByProductId(productId).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }

  getStockStatus(): string {
    if (!this.product) return '';
    if (this.product.quantity === 0) return 'Out of Stock';
    if (this.product.quantity <= this.product.reorderLevel) return 'Low Stock';
    return 'In Stock';
  }

  getStatusClass(): string {
    if (!this.product) return '';
    if (this.product.quantity === 0) return 'status-critical';
    if (this.product.quantity <= this.product.reorderLevel) return 'status-warning';
    return 'status-good';
  }

  getTotalInflow(): number {
    return this.orders
      .filter(o => o.type === 'IN')
      .reduce((sum, o) => sum + o.quantity, 0);
  }

  getTotalOutflow(): number {
    return this.orders
      .filter(o => o.type === 'OUT')
      .reduce((sum, o) => sum + o.quantity, 0);
  }
}
