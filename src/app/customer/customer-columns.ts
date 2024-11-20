import { ComponentRef } from '@angular/core';
import { CustomMatIconBtnComponent } from '../../core/dynamic/components/custom-mat-icon-btn.component';

export function getCustomerColumns(
  openDeleteDialog: (id: string, name: string) => void,
  navigateToCustomer: (id: string) => void
): any[] {
  return [
    { tableHeader: 'First Name', key: 'firstName', sortable: true },
    { tableHeader: 'Last Name', key: 'lastName', sortable: true },
    { tableHeader: 'Email', key: 'email', sortable: true },
    {
      tableHeader: 'Birthdate',
      key: 'birthDate',
      sortable: true,
      renderFn: (data: any) => {
        const date = new Date(data.birthDate).toLocaleDateString('de-DE');
        return `${date}`;
      }
    },
    {
      tableHeader: 'Adress',
      key: 'adress',
      sortable: true,
      renderFn: (data: any) => `${data.street} ${data.houseNumber}`
    },
    {
      tableHeader: 'Edit',
      key: 'edit',
      sortable: false,
      render: [
        {
          component: CustomMatIconBtnComponent,
          callback: (componentRef: ComponentRef<CustomMatIconBtnComponent>, data: any) => {
            componentRef.setInput('icon', 'delete');
            componentRef.location.nativeElement.addEventListener('click', () =>
              openDeleteDialog(data._id, data.firstName)
            );
          }
        },
        {
          component: CustomMatIconBtnComponent,
          callback: (componentRef: ComponentRef<CustomMatIconBtnComponent>, data: any) => {
            componentRef.setInput('icon', 'edit');
            componentRef.location.nativeElement.addEventListener('click', () =>
              navigateToCustomer(data._id)
            );
          }
        }
      ]
    }
  ];
}
