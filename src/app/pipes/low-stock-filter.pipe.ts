import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/product.model';

@Pipe({
  name: 'lowStockFilter',
  standalone: true
})
export class LowStockFilterPipe implements PipeTransform {
  transform(products: Product[]): Product[] {
    if (!products) return [];
    return products.filter(product => product.quantity <= product.reorderLevel);
  }
}
