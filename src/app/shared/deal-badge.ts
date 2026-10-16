import { Component, computed, input } from '@angular/core';

import { DealScore } from '../core/models/catalog.models';

const LABELS: Record<DealScore, string> = {
  excellent: 'Excellent deal',
  good: 'Good deal',
  normal: 'Normal price',
  expensive: 'Watch price',
};

/** Small coloured badge reflecting a deal score. */
@Component({
  selector: 'app-deal-badge',
  templateUrl: './deal-badge.html',
  styleUrl: './deal-badge.scss',
})
export class DealBadge {
  readonly score = input.required<DealScore>();
  readonly label = computed(() => LABELS[this.score()]);
}
