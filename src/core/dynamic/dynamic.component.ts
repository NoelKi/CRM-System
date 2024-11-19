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
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: ` <div #container></div> `
})
export class DynamicComponent<T> implements OnInit {
  // toDo input type generic, replace any with T
  elements = input.required<IDynamicObj<T>[] | IDynamicObj<T>>();
  data = input.required<User>();

  private _vcr = viewChild('container', { read: ViewContainerRef });

  componentRef?: ComponentRef<any>;

  ngOnInit(): void {
    // check for array of object or single objects
    if (Object.prototype.toString.call(this.elements()) === '[object Array]') {
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
