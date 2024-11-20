import { CdkDragDrop, CdkDragStart, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
];
@Component({
    selector: 'app-playground',
    imports: [MatTableModule, DragDropModule],
    templateUrl: './playground.component.html',
    styleUrl: './playground.component.scss'
})
export class PlaygroundComponent implements OnInit {
  // ------ Behaviorsubject: ------
  // Initialisiere ein BehaviorSubject mit einem Startwert von 0
  // counter$ = new BehaviorSubject<number>(0);

  // // Erhöhe den Wert
  // increment() {
  //   this.counter$.next(this.counter$.value + 1);
  // }

  // // Verringere den Wert
  // decrement() {
  //   this.counter$.next(this.counter$.value - 1);
  // }

  // double() {
  //   this.counter$.next(this.counter$.value * 2);
  // }

  // // Setze den Wert zurück
  // reset() {
  //   this.counter$.next(0);
  // }

  // // ------ Filter mit combinelatest ------
  // // Beispiel-Liste von Namen, die gefiltert werden soll
  // public names = [
  //   'Alice',
  //   'Bob',
  //   'Charlie',
  //   'David',
  //   'Eve',
  //   'Frank',
  //   'Hans',
  //   'Peter',
  //   'Hennriette',
  //   'Peter',
  //   'Neter',
  //   'Kleteras'
  // ];

  // // BehaviorSubject für den Filterwert und die Liste
  // filter$ = new BehaviorSubject<string>('');
  // names$ = new BehaviorSubject<string[]>(this.names);
  // // Gefilterte Liste als Observable
  // filteredNames$ = combineLatest([this.names$, this.filter$]).pipe(
  //   map(([names, filter]) =>
  //     names.filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
  //   )
  // );

  // // Methode zum Aktualisieren des Filters
  // updateFilter(value: string) {
  //   this.filter$.next(value);
  // }

  // // Um Typescriptfehler zu umgehen
  // updateFilterFromEvent(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.updateFilter(inputElement.value);
  // }

  // // add new name to show combine latest reacts to change of both input values
  // addName(event: Event, input: HTMLInputElement) {
  //   event.preventDefault();
  //   const newName = input.value.trim();
  //   if (newName) {
  //     // Holt die aktuelle Liste und fügt den neuen Namen hinzu
  //     const updatedNames = [...this.names$.value, newName];
  //     this.names$.next(updatedNames); // Aktualisiert das BehaviorSubject
  //     input.value = ''; // Setzt das Eingabefeld zurück
  //   }
  // }

  // // ------ Filter mit Pagination ------
  // // Hinzufügen von Sortier- und Paginierungsoptionen
  // sort$ = new BehaviorSubject<string>('asc');
  // page$ = new BehaviorSubject<number>(0);
  // pageSize$ = new BehaviorSubject<number>(5);

  // // Kombiniere Filter, Sortierung und Paginierung
  // filteredAndPagedNames$ = combineLatest([
  //   this.names$,
  //   this.filter$,
  //   this.sort$,
  //   this.page$,
  //   this.pageSize$
  // ]).pipe(
  //   map(([names, filter, sort, page, pageSize]) => {
  //     const filtered = names.filter((name) => name.toLowerCase().includes(filter.toLowerCase()));
  //     const sorted = filtered.sort((a, b) =>
  //       sort === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
  //     );
  //     const start = page * pageSize;
  //     return sorted.slice(start, start + pageSize);
  //   })
  // );

  // // Methoden für Sortierung und Paginierung
  // updateSort(direction: string) {
  //   this.sort$.next(direction);
  // }

  // updatePage(newPage: number) {
  //   this.page$.next(newPage);
  // }

  // Table
  title = 'Material Table column drag and drop';

  columns: any[] = [
    { field: 'position' },
    { field: 'name' },
    { field: 'weight' },
    { field: 'symbol' }
  ];
  displayedColumns: string[] = [];
  dataSource = ELEMENT_DATA;

  previousIndex!: number;

  ngOnInit() {
    this.setDisplayedColumns();
  }

  setDisplayedColumns() {
    this.columns.forEach((colunm, index) => {
      colunm.index = index;
      this.displayedColumns[index] = colunm.field;
    });
  }

  dragStarted(event: CdkDragStart<any>, index: number) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDragDrop<any>, index: number) {
    if (event) {
      moveItemInArray(this.columns, this.previousIndex, index);
      this.setDisplayedColumns();
    }
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
