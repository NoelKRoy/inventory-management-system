import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { of } from 'rxjs';

// Mock data for fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    quantity: 15,
    reorderLevel: 5,
    supplierId: 1,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Desktop Monitor',
    description: '27-inch 4K monitor',
    price: 399.99,
    quantity: 8,
    reorderLevel: 3,
    supplierId: 1,
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Keyboard',
    description: 'Mechanical keyboard',
    price: 149.99,
    quantity: 2,
    reorderLevel: 10,
    supplierId: 2,
    category: 'Accessories'
  }
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:3000/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.getAll().subscribe(
      products => this.productsSubject.next(products),
      () => this.productsSubject.next(MOCK_PRODUCTS)
    );
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api).pipe(
      catchError(() => {
        console.warn('Using mock data for products');
        return of(MOCK_PRODUCTS);
      })
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`).pipe(
      catchError(() => {
        const mockProduct = MOCK_PRODUCTS.find(p => p.id === id);
        return of(mockProduct!);
      })
    );
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.api, product).pipe(
      tap(newProduct => {
        const current = this.productsSubject.getValue();
        this.productsSubject.next([...current, newProduct]);
      }),
      catchError(() => {
        const newId = Math.max(...MOCK_PRODUCTS.map(p => p.id), 0) + 1;
        const newProduct = { ...product, id: newId };
        MOCK_PRODUCTS.push(newProduct);
        const current = this.productsSubject.getValue();
        this.productsSubject.next([...current, newProduct]);
        return of(newProduct);
      })
    );
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, product).pipe(
      tap(updated => {
        const current = this.productsSubject.getValue();
        const index = current.findIndex(p => p.id === id);
        if (index >= 0) {
          current[index] = updated;
          this.productsSubject.next([...current]);
        }
      }),
      catchError(() => {
        const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (index >= 0) {
          MOCK_PRODUCTS[index] = product;
        }
        const current = this.productsSubject.getValue();
        const currentIndex = current.findIndex(p => p.id === id);
        if (currentIndex >= 0) {
          current[currentIndex] = product;
          this.productsSubject.next([...current]);
        }
        return of(product);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() => {
        const current = this.productsSubject.getValue();
        this.productsSubject.next(current.filter(p => p.id !== id));
      }),
      catchError(() => {
        const mockIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (mockIndex >= 0) {
          MOCK_PRODUCTS.splice(mockIndex, 1);
        }
        const current = this.productsSubject.getValue();
        this.productsSubject.next(current.filter(p => p.id !== id));
        return of();
      })
    );
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      tap(products => 
        products.filter(p => p.quantity <= p.reorderLevel)
      )
    );
  }
}
