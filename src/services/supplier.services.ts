import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';
import { of } from 'rxjs';

// Mock data for fallback
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: 'Tech Solutions Inc.',
    contact: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1-800-123-4567',
    city: 'New York',
    address: '123 Tech Street'
  },
  {
    id: 2,
    name: 'Global Supplies Ltd.',
    contact: 'Jane Doe',
    email: 'jane@globalsupplies.com',
    phone: '+1-800-987-6543',
    city: 'Los Angeles',
    address: '456 Supply Ave'
  }
];

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private api = 'http://localhost:3000/suppliers';
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  public suppliers$ = this.suppliersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.getAll().subscribe(
      suppliers => this.suppliersSubject.next(suppliers),
      () => this.suppliersSubject.next(MOCK_SUPPLIERS)
    );
  }

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.api).pipe(
      catchError(() => {
        console.warn('Using mock data for suppliers');
        return of(MOCK_SUPPLIERS);
      })
    );
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.api}/${id}`).pipe(
      catchError(() => {
        const mockSupplier = MOCK_SUPPLIERS.find(s => s.id === id);
        return of(mockSupplier!);
      })
    );
  }

  create(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.api, supplier).pipe(
      tap(newSupplier => {
        const current = this.suppliersSubject.getValue();
        this.suppliersSubject.next([...current, newSupplier]);
      }),
      catchError(() => {
        const newId = Math.max(...MOCK_SUPPLIERS.map(s => s.id), 0) + 1;
        const newSupplier = { ...supplier, id: newId };
        MOCK_SUPPLIERS.push(newSupplier);
        const current = this.suppliersSubject.getValue();
        this.suppliersSubject.next([...current, newSupplier]);
        return of(newSupplier);
      })
    );
  }

  update(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.api}/${id}`, supplier).pipe(
      tap(updated => {
        const current = this.suppliersSubject.getValue();
        const index = current.findIndex(s => s.id === id);
        if (index >= 0) {
          current[index] = updated;
          this.suppliersSubject.next([...current]);
        }
      }),
      catchError(() => {
        const index = MOCK_SUPPLIERS.findIndex(s => s.id === id);
        if (index >= 0) {
          MOCK_SUPPLIERS[index] = supplier;
        }
        const current = this.suppliersSubject.getValue();
        const currentIndex = current.findIndex(s => s.id === id);
        if (currentIndex >= 0) {
          current[currentIndex] = supplier;
          this.suppliersSubject.next([...current]);
        }
        return of(supplier);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() => {
        const current = this.suppliersSubject.getValue();
        this.suppliersSubject.next(current.filter(s => s.id !== id));
      }),
      catchError(() => {
        const mockIndex = MOCK_SUPPLIERS.findIndex(s => s.id === id);
        if (mockIndex >= 0) {
          MOCK_SUPPLIERS.splice(mockIndex, 1);
        }
        const current = this.suppliersSubject.getValue();
        this.suppliersSubject.next(current.filter(s => s.id !== id));
        return of();
      })
    );
  }
}
