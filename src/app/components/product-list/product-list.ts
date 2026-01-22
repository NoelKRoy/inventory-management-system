import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.error = 'Failed to delete product';
          console.error(err);
        }
      });
    }
  }

  getStockStatus(product: Product): string {
    if (product.quantity === 0) return 'Out of Stock';
    if (product.quantity <= product.reorderLevel) return 'Low Stock';
    return 'In Stock';
  }

  getStatusClass(product: Product): string {
    if (product.quantity === 0) return 'status-critical';
    if (product.quantity <= product.reorderLevel) return 'status-warning';
    return 'status-good';
  }
}
