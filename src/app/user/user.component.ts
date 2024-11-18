import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  computed,
  inject,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { CustomMatIconBtnComponent } from '../../core/dynamic/components/custom-mat-icon-btn.component';
import { DynamicAdressComponent } from '../../core/dynamic/components/dynamic-adress.component';
import { DynamicDatesComponent } from '../../core/dynamic/components/dynamic-dates.component';
import { DynamicComponent as DynamicRenderComponent } from '../../core/dynamic/dynamic.component';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';
import { DialogAddUserComponent } from '../user/components/dialog-add-user/dialog-add-user.component';
import { DialogDeleteUserComponent } from '../user/components/dialog-delete-user/dialog-delete-user.component';

// todo Component dynamic rename#, refactor, hilfscomponente für date#, hilfscomponenten ordner anlegen(in core)#, komplette Zeileninhalt an dynamik übergeben#,
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    DynamicRenderComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements AfterViewInit {
  protected componentInputs = {};
  private _userService = inject(UserService);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private _sanitizer = inject(DomSanitizer);

  private _vcr = viewChild('container', { read: ViewContainerRef });

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'birthDate', 'street', 'edit'];

  columns: any[] = [
    { tableHeader: 'First Name', key: 'firstName', sortable: true },
    { tableHeader: 'Last Name', key: 'lastName', sortable: true },
    { tableHeader: 'Email', key: 'email', sortable: true },
    {
      tableHeader: 'Birthdate',
      key: 'birthDate',
      sortable: true,
      render: {
        component: DynamicDatesComponent,
        callback: (componentRef: ComponentRef<DynamicDatesComponent>, data: any) => {
          componentRef.setInput('date', data.birthDate);
          componentRef.setInput('type', 'short');
        }
      }
    },
    {
      tableHeader: 'Street',
      key: 'street',
      sortable: true,
      render: {
        component: DynamicAdressComponent,
        callback: (componentRef: ComponentRef<DynamicAdressComponent>, data: any) => {
          componentRef.setInput('street', data.street);
          componentRef.setInput('houseNumber', data.houseNumber);
        }
      }
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
              this.openDeleteDialog(data._id, data.firstName)
            );
          }
        },
        {
          component: CustomMatIconBtnComponent,
          callback: (componentRef: ComponentRef<CustomMatIconBtnComponent>, data: any) => {
            componentRef.setInput('icon', 'edit');
            componentRef.location.nativeElement.addEventListener('click', () =>
              this._router.navigate([`/user/${data._id}`])
            );
          }
        }
      ]
    }
  ];

  usersData$!: Observable<User[]>;

  isLoadingResults = false;
  private _sortDirection = signal('asc');
  private _sortActive = signal('');
  private _filter = signal('');
  private _refreshPage = signal(0);
  pageIndex = signal(0);
  pageSize = signal(5);
  totalLength = 0;
  previousIndex: number = 0;

  queryParams = computed(() => {
    return {
      pageSize: this.pageSize(),
      pageIndex: this.pageIndex(),
      filterValue: this._filter(),
      sortField: this._sortActive(),
      sortDirection: this._sortDirection(),
      refreshPage: this._refreshPage()
    };
  });

  usersData = toSignal(
    toObservable(this.queryParams).pipe(
      switchMap(({ refreshPage, ...params }) => {
        this.isLoadingResults = true;

        return this._userService.getUsers(params).pipe(
          map((res) => {
            this.isLoadingResults = false;
            this.totalLength = res.totalLength;
            return res.users;
          })
        );
      })
    ),
    { initialValue: [] }
  );

  componentRef?: ComponentRef<DynamicRenderComponent>;

  constructor() {}
  ngAfterViewInit(): void {
    this.createComponent();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  getSanitizedHtml(html: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  createComponent(): void {
    this.destroyComponent();
    this.componentRef = this._vcr()?.createComponent(DynamicRenderComponent);
  }

  destroyComponent(): void {
    this._vcr()?.clear();
  }

  isDate(value: any): boolean {
    return value === Date;
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  onFilterChange(value: string): void {
    this.pageIndex.set(0);
    this._filter.set(value);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  onSortChange(sortState: Sort): void {
    this.pageIndex.set(0);
    this._sortDirection.set(sortState.direction);
    this._sortActive.set(sortState.active);
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogAddUserComponent, {
      height: '660px',
      width: '620px',
      maxWidth: '100%'
    });
    dialogRef.afterClosed().subscribe((user) => {
      this.isLoadingResults = true;
      this._userService.addUser(user).subscribe({
        next: (res) => {
          if (res.status === 'OK') {
            user.profilPicSrc = res.profilePicSrc;
            user._id = res._id;
            this.openSnackBar(
              user.firstName + ' ' + user.lastName + ' was added to Users',
              'close'
            );
            this._router.navigate(['./user/' + res._id]);
          }
        },
        error: (error) => {
          console.error('Error posting user', error);
        }
      });
    });
  }

  openDeleteDialog(_id: string, name: string): void {
    const dialogRef = this._dialog.open(DialogDeleteUserComponent, {
      height: '200px',
      width: '200px',
      maxWidth: '100%',
      data: {
        name: name
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this._userService.deleteUser(_id).subscribe({
          next: (res) => {
            if (res.status === 'OK') {
              this._refreshPage.set(this._refreshPage() + 1);
              this.openSnackBar('User succesfully deleted!', 'close');
            }
          },
          error: (error) => {
            console.error('Error deleting user', error);
            this.openSnackBar('User was not deleted properly', 'close');
          }
        });
      }
    });
  }
}
