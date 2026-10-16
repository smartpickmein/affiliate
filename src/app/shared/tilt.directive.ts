import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * Interactive 3D tilt: the host rotates toward the cursor with perspective and a
 * subtle lift, then eases back on leave. Honors `prefers-reduced-motion`.
 *
 * Usage: `<mat-card appTilt [tiltMax]="10"> … </mat-card>`
 */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Maximum rotation in degrees on each axis. */
  readonly tiltMax = input(9);

  private frame = 0;
  private readonly reduce =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  @HostListener('pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    if (this.reduce) {
      return;
    }
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.apply(event));
  }

  @HostListener('pointerleave')
  onLeave(): void {
    cancelAnimationFrame(this.frame);
    const host = this.el.nativeElement;
    host.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    host.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
  }

  private apply(event: PointerEvent): void {
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const max = this.tiltMax();
    host.style.transition = 'transform 0.08s ease-out';
    host.style.transform =
      `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
      `rotateY(${(px * max).toFixed(2)}deg) translateZ(8px) scale(1.03)`;
  }
}
