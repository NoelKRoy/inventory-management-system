import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierService } from '../../../services/supplier.services';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList implements OnInit {
  suppliers: Supplier[] = [];
  loading = true;
  error: string | null = null;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load suppliers';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.delete(id).subscribe({
        next: () => {
          this.loadSuppliers();
        },
        error: (err) => {
          this.error = 'Failed to delete supplier';
          console.error(err);
        }
      });
    }
  }
}
