
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { of } from 'rxjs';

// Mock data for fallback
const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    productId: 1,
    quantity: 5,
    orderDate: new Date().toISOString(),
    type: 'IN',
    status: 'COMPLETED',
    notes: 'Restocking order'
  },
  {
    id: 2,
    productId: 2,
    quantity: 2,
    orderDate: new Date().toISOString(),
    type: 'OUT',
    status: 'COMPLETED',
    notes: 'Customer order'
  },
  {
    id: 3,
    productId: 3,
    quantity: 10,
    orderDate: new Date(Date.now() - 86400000).toISOString(),
    type: 'IN',
    status: 'PENDING',
    notes: 'Pending delivery'
  }
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = 'http://localhost:3000/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.getAll().subscribe(
      orders => this.ordersSubject.next(orders),
      () => this.ordersSubject.next(MOCK_ORDERS)
    );
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.api).pipe(
      catchError(() => {
        console.warn('Using mock data for orders');
        return of(MOCK_ORDERS);
      })
    );
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.api}/${id}`).pipe(
      catchError(() => {
        const mockOrder = MOCK_ORDERS.find(o => o.id === id);
        return of(mockOrder!);
      })
    );
  }

  getByProductId(productId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}?productId=${productId}`).pipe(
      catchError(() => {
        return of(MOCK_ORDERS.filter(o => o.productId === productId));
      })
    );
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.api, order).pipe(
      tap(newOrder => {
        const current = this.ordersSubject.getValue();
        this.ordersSubject.next([...current, newOrder]);
      }),
      catchError(() => {
        const newId = Math.max(...MOCK_ORDERS.map(o => o.id), 0) + 1;
        const newOrder = { ...order, id: newId };
        MOCK_ORDERS.push(newOrder);
        const current = this.ordersSubject.getValue();
        this.ordersSubject.next([...current, newOrder]);
        return of(newOrder);
      })
    );
  }

  update(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.api}/${id}`, order).pipe(
      tap(updated => {
        const current = this.ordersSubject.getValue();
        const index = current.findIndex(o => o.id === id);
        if (index >= 0) {
          current[index] = updated;
          this.ordersSubject.next([...current]);
        }
      }),
      catchError(() => {
        const index = MOCK_ORDERS.findIndex(o => o.id === id);
        if (index >= 0) {
          MOCK_ORDERS[index] = order;
        }
        const current = this.ordersSubject.getValue();
        const currentIndex = current.findIndex(o => o.id === id);
        if (currentIndex >= 0) {
          current[currentIndex] = order;
          this.ordersSubject.next([...current]);
        }
        return of(order);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() => {
        const current = this.ordersSubject.getValue();
        this.ordersSubject.next(current.filter(o => o.id !== id));
      }),
      catchError(() => {
        const mockIndex = MOCK_ORDERS.findIndex(o => o.id === id);
        if (mockIndex >= 0) {
          MOCK_ORDERS.splice(mockIndex, 1);
        }
        const current = this.ordersSubject.getValue();
        this.ordersSubject.next(current.filter(o => o.id !== id));
        return of();
      })
    );
  }

  getOrdersByType(type: 'IN' | 'OUT'): Observable<Order[]> {
    return this.orders$.pipe(
      tap(orders => orders.filter(o => o.type === type))
    );
  }

  getPendingOrders(): Observable<Order[]> {
    return this.orders$.pipe(
      tap(orders => orders.filter(o => o.status === 'PENDING'))
    );
  }
}
