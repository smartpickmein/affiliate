import { computed, Injectable, signal } from '@angular/core';

/** Tracks in-flight HTTP requests so the shell can show a global progress bar. */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly inflight = signal(0);
  readonly isLoading = computed(() => this.inflight() > 0);

  start(): void {
    this.inflight.update((n) => n + 1);
  }

  stop(): void {
    this.inflight.update((n) => Math.max(0, n - 1));
  }
}
