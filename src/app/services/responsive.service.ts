import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  breakpointObserver = inject(BreakpointObserver);
  private readonly _small = '(max-width: 959.98px)';
  private readonly _medium = '(min-width: 960px) and (max-width: 1279.98px)';
  private readonly _large = '(min-width: 1280px)';

  screenWidth = toSignal(this.breakpointObserver.observe([this._small, this._medium, this._large]));

  smallWidth = computed(() => this.screenWidth()?.breakpoints[this._small]);
  mediumWidth = computed(() => this.screenWidth()?.breakpoints[this._medium]);
  largeWidth = computed(() => this.screenWidth()?.breakpoints[this._large]);
}
