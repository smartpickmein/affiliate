import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { DealScore, Product } from '../core/models/catalog.models';
import { cheapestOffer } from '../core/utils/pricing';
import { DealBadge } from './deal-badge';
import { InrPipe } from './inr.pipe';
import { TiltDirective } from './tilt.directive';

/** Reusable product tile: thumbnail, title, cheapest price and offer count. */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, DealBadge, InrPipe, TiltDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly score = input<DealScore | null>(null);
  readonly cheapest = computed(() => cheapestOffer(this.product()));
  readonly initial = computed(() => this.product().brand.charAt(0).toUpperCase());
}
