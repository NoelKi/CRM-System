import {
  Component,
  ComponentRef,
  input,
  OnInit,
  Type,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../models/customer.model';

@Component({
    selector: 'app-dynamic',
    imports: [MatIconModule, MatButtonModule],
    template: `<ng-container #container></ng-container>`
})
export class DynamicComponent<T> implements OnInit {
  elements = input.required<IDynamicObj<T>[] | IDynamicObj<T>>();
  data = input.required<Customer>();

  private _vcr = viewChild('container', { read: ViewContainerRef });

  componentRef?: ComponentRef<any>;

  ngOnInit(): void {
    if (Array.isArray(this.elements())) {
      for (const element of this.elements() as IDynamicObj<T>[]) {
        this.createComponent(element);
      }
    } else {
      this.createComponent(this.elements() as IDynamicObj<T>);
    }
  }

  // creation of generic Component
  createComponent(obj: IDynamicObj<T>): void {
    this.componentRef = this._vcr()?.createComponent(obj.component);
    obj.callback(this.componentRef!, this.data());
  }

  destroyComponent(): void {
    this._vcr()?.clear();
  }
}

export interface IDynamicObj<T> {
  component: Type<T>; // hilfsstruktur für typeScript um eine Angular Componente zu verifizieren.
  callback: (componentRef: ComponentRef<T>, data: any) => void;
}
