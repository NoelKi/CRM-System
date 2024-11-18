import { Component, ComponentRef, input, OnInit, viewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: ` <div #container></div> `,
  styleUrl: './dynamic.component.scss'
})
export class TableRenderComponent implements OnInit {
  //inputs
  elements = input.required<IDynamicObj[] | IDynamicObj>();
  data = input.required<User>();

  private _vcr = viewChild('container', { read: ViewContainerRef });

  componentRef?: ComponentRef<any>;

  constructor() {}

  ngOnInit(): void {
    // check for array of object or single objects
    if (Object.prototype.toString.call(this.elements()) === '[object Array]') {
      for (const element of this.elements() as IDynamicObj[]) {
        this.createComponent(element);
      }
    } else {
      this.createComponent(this.elements() as IDynamicObj);
    }
  }

  // creation of generic Component
  createComponent(obj: IDynamicObj): void {
    this.componentRef = this._vcr()?.createComponent(obj.component);
    obj.callback(this.componentRef!, this.data());
  }

  destroyComponent(): void {
    this._vcr()?.clear();
  }
}

export interface IDynamicObj {
  component: any;
  callback: (componentRef: ComponentRef<any>, data: any) => void;
  onclick: (id: string, name: string) => void;
  btnCallback: (btn: any) => void;
}
