import { Component, input } from '@angular/core';
import { ProductData } from '../../../core/models/product.interface';

@Component({
  selector: 'app-detail-description',
  imports: [],
  templateUrl: './detail-description.component.html',
  styleUrl: './detail-description.component.css',
})
export class DetailDescriptionComponent {
  readonly product = input.required<ProductData>();
}
