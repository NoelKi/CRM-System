import { Component, ComponentRef, input, OnInit, viewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: ` <div #container></div> `
})
export class DynamicComponent implements OnInit {
  // toDo input type generic, replace any with T
  elements = input.required<IDynamicObj<any>[] | IDynamicObj<any>>();
  data = input.required<User>();

  private _vcr = viewChild('container', { read: ViewContainerRef });

  componentRef?: ComponentRef<any>;

  ngOnInit(): void {
    // check for array of object or single objects
    if (Object.prototype.toString.call(this.elements()) === '[object Array]') {
      for (const element of this.elements() as IDynamicObj<any>[]) {
        this.createComponent(element);
      }
    } else {
      this.createComponent(this.elements() as IDynamicObj<any>);
    }
  }

  // creation of generic Component
  createComponent(obj: IDynamicObj<any>): void {
    this.componentRef = this._vcr()?.createComponent(obj.component);
    obj.callback(this.componentRef!, this.data());
  }

  destroyComponent(): void {
    this._vcr()?.clear();
  }
}

export interface IDynamicObj<T> {
  component: T;
  callback: (componentRef: ComponentRef<T>, data: any) => void;
}
