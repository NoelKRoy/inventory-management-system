import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { Order } from '../../../models/order.model';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderForm implements OnInit {
  orderForm!: FormGroup;
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  orderId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.orderForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      type: ['IN', Validators.required],
      status: ['PENDING', Validators.required],
      notes: [''],
      orderDate: [new Date().toISOString().slice(0, 16), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.orderId = parseInt(id);
        this.isEditMode = true;
        this.loadOrder(this.orderId);
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products';
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getById(id).subscribe({
      next: (data) => {
        this.orderForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order';
        console.error(err);
        this.loading = false;
      }
    });
  }

  submitForm(): void {
    if (this.orderForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.orderForm.value;

    if (this.isEditMode && this.orderId) {
      this.orderService.update(this.orderId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.error = 'Failed to update order';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.orderService.create(formValue).subscribe({
        next: () => {
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.error = 'Failed to create order';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.orderForm.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${this.capitalize(field)} is required`;
    if (control.errors['min']) return `${this.capitalize(field)} must be greater than 0`;

    return 'Invalid input';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
