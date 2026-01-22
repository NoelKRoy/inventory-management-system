import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';

@Directive({
  selector: '[appReorderLevel]',
  standalone: true
})
export class ReorderLevelDirective implements OnInit {
  @Input() appReorderLevel!: Product;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appReorderLevel) {
      if (this.appReorderLevel.quantity <= this.appReorderLevel.reorderLevel) {
        this.el.nativeElement.style.backgroundColor = '#fff3cd';
        this.el.nativeElement.style.borderLeft = '4px solid #ff9800';
        this.el.nativeElement.style.padding = '0.5rem';
        this.el.nativeElement.style.borderRadius = '4px';

        if (this.appReorderLevel.quantity === 0) {
          this.el.nativeElement.style.backgroundColor = '#f8d7da';
          this.el.nativeElement.style.borderLeftColor = '#dc3545';
        }
      }
    }
  }
}
