import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  BreakpointObserver = inject(BreakpointObserver);
  private readonly small = '(max-width: 959.98px)';
  private readonly medium = '(min-width: 960px) and (max-width: 1279.98px)';
  private readonly large = '(min-width: 1280px)';

  screenWidth = toSignal(this.BreakpointObserver.observe([this.small, this.medium, this.large]));

  smallWidth = computed(() => this.screenWidth()?.breakpoints[this.small]);
  mediumWidth = computed(() => this.screenWidth()?.breakpoints[this.medium]);
  largeWidth = computed(() => this.screenWidth()?.breakpoints[this.large]);
}
