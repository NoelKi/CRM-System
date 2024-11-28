import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomerEnum } from '../../../core/enum/api.enum';
import { Customer } from '../../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  http = inject(HttpClient);
  customers = signal([] as Customer[]);
  customersLength: number = 0;
  private _snackBar = inject(MatSnackBar);
  jwt = this.loadJwtFromStorage();
  constructor() {}

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  addCustomer(customer: Customer): Observable<IPostRes> {
    return this.http.post<IPostRes>(CustomerEnum.addCustomer, customer);
  }

  deleteCustomer(id: string): Observable<IDeleteRes> {
    return this.http.delete<IDeleteRes>(CustomerEnum.deleteCustomer.replace(':id', id));
  }

  async getCustomersFirstValueFrom(data: IGetCustomersParams): Promise<void> {
    const httpParams = this.createHttpParams(data);
    try {
      const { totalLength, customers } = await firstValueFrom(
        this.http.get<IGetRes>(CustomerEnum.getCustomers, {
          params: httpParams
        })
      );
      this.customers.set(customers);
      this.customersLength = totalLength;
    } catch (error) {
      console.error('Error fetching customer', error);
    }
  }

  getCustomers(data: IGetCustomersParams): Observable<IGetRes> {
    const httpParams = this.createHttpParams(data);
    return this.http.get<IGetRes>(CustomerEnum.getCustomers, {
      params: httpParams
    });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(CustomerEnum.getCustomer.replace(':id', id));
  }

  editCustomer(newCustomer: Customer): Observable<IPutRes> {
    return this.http.put<IPutRes>(CustomerEnum.editCustomer, newCustomer);
  }

  getCustomerImg(filename: string): Observable<any> {
    return this.http.get(CustomerEnum.getCustomerImg, {
      responseType: 'blob'
    });
  }

  editCustomerImg(newCustomer: Customer, file: File): Observable<IPutImgRes> {
    const formData = new FormData();

    formData.append('id', newCustomer._id!);
    formData.append('file', file);

    return this.http.put<IPutImgRes>(CustomerEnum.editCustomerImg, formData);
  }

  createHttpParams(data: IGetCustomersParams): HttpParams {
    let httpParams = new HttpParams()
      .set('pageSize', data.pageSize.toString())
      .set('pageIndex', data.pageIndex.toString());
    if (data.filterValue) httpParams = httpParams.set('filter', data.filterValue);
    if (data.sortField) httpParams = httpParams.set('sortField', data.sortField);
    if (data.sortDirection) httpParams = httpParams.set('sortDirection', data.sortDirection);

    return httpParams;
  }

  loadJwtFromStorage(): any {
    const json = localStorage.getItem('jwt');
    if (json) {
      return json;
    }
  }
}

export interface IPutRes {
  status: string;
}

export interface IPutImgRes extends IPutRes {
  profilPicSrc: string;
}
interface IDeleteRes extends IPutRes {
  id: string;
}

interface IPostRes extends IDeleteRes {
  profilePicSrc: string;
  _id: string;
}

interface IGetRes {
  customers: Customer[];
  totalLength: number;
}

export interface IGetCustomersParams {
  pageSize: number;
  pageIndex: number;
  filterValue?: string;
  sortField?: string;
  sortDirection?: string;
}
