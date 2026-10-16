import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Reusable loading / error / empty state panel used by feature pages. */
@Component({
  selector: 'app-state-panel',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './state-panel.html',
  styleUrl: './state-panel.scss',
})
export class StatePanel {
  readonly mode = input.required<'loading' | 'error' | 'empty'>();
  readonly message = input<string>('');
  readonly retry = output<void>();
}
