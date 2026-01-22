import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { SupplierService } from '../../../services/supplier.services';
import { Product } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  suppliers: Supplier[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      reorderLevel: ['', [Validators.required, Validators.min(1)]],
      supplierId: ['', Validators.required],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.productId = parseInt(id);
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.error = 'Failed to load suppliers';
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.productForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product';
        console.error(err);
        this.loading = false;
      }
    });
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/products', this.productId]);
        },
        error: (err) => {
          this.error = 'Failed to update product';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.productService.create(formValue).subscribe({
        next: (product) => {
          this.router.navigate(['/products', product.id]);
        },
        error: (err) => {
          this.error = 'Failed to create product';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.productForm.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${this.capitalize(field)} is required`;
    if (control.errors['minlength']) return `${this.capitalize(field)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['min']) return `${this.capitalize(field)} must be greater than 0`;

    return 'Invalid input';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
