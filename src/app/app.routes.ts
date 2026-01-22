import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { ProductForm } from './components/product-form/product-form';
import { SupplierList } from './components/supplier-list/supplier-list';
import { SupplierForm } from './components/supplier-form/supplier-form';
import { OrderTracker } from './components/order-tracker/order-tracker';
import { OrderForm } from './components/order-form/order-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductList
      },
      {
        path: 'new',
        component: ProductForm
      },
      {
        path: ':id',
        component: ProductDetail
      },
      {
        path: ':id/edit',
        component: ProductForm
      }
    ]
  },
  {
    path: 'suppliers',
    children: [
      {
        path: '',
        component: SupplierList
      },
      {
        path: 'new',
        component: SupplierForm
      },
      {
        path: ':id/edit',
        component: SupplierForm
      }
    ]
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        component: OrderTracker
      },
      {
        path: 'new',
        component: OrderForm
      },
      {
        path: ':id/edit',
        component: OrderForm
      }
    ]
  }
];

