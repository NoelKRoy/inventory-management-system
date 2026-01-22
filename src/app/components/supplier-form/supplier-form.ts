import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../services/supplier.services';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {
  supplier: Supplier = {
    id: 0,
    name: '',
    contact: '',
    email: '',
    phone: '',
    city: '',
    address: ''
  };

  loading = false;
  error: string | null = null;
  isEditMode = false;
  supplierId: number | null = null;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.supplierId = parseInt(id);
        this.isEditMode = true;
        this.loadSupplier(this.supplierId);
      }
    });
  }

  loadSupplier(id: number): void {
    this.loading = true;
    this.supplierService.getById(id).subscribe({
      next: (data) => {
        this.supplier = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load supplier';
        console.error(err);
        this.loading = false;
      }
    });
  }

  submitForm(): void {
    if (!this.supplier.name || !this.supplier.contact || !this.supplier.email) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.supplierId) {
      this.supplierService.update(this.supplierId, this.supplier).subscribe({
        next: () => {
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          this.error = 'Failed to update supplier';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.supplierService.create(this.supplier).subscribe({
        next: () => {
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          this.error = 'Failed to create supplier';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
