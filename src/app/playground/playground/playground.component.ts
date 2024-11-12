import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})
export class PlaygroundComponent {
  // ------ Behaviorsubject: ------
  // Initialisiere ein BehaviorSubject mit einem Startwert von 0
  counter$ = new BehaviorSubject<number>(0);

  // Erhöhe den Wert
  increment() {
    this.counter$.next(this.counter$.value + 1);
  }

  // Verringere den Wert
  decrement() {
    this.counter$.next(this.counter$.value - 1);
  }

  double() {
    this.counter$.next(this.counter$.value * 2);
  }

  // Setze den Wert zurück
  reset() {
    this.counter$.next(0);
  }

  // ------ Filter mit combinelatest ------
  // Beispiel-Liste von Namen, die gefiltert werden soll
  public names = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank',
    'Hans',
    'Peter',
    'Hennriette',
    'Peter',
    'Neter',
    'Kleteras'
  ];

  // BehaviorSubject für den Filterwert und die Liste
  filter$ = new BehaviorSubject<string>('');
  names$ = new BehaviorSubject<string[]>(this.names);
  // Gefilterte Liste als Observable
  filteredNames$ = combineLatest([this.names$, this.filter$]).pipe(
    map(([names, filter]) =>
      names.filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
    )
  );

  // Methode zum Aktualisieren des Filters
  updateFilter(value: string) {
    this.filter$.next(value);
  }

  // Um Typescriptfehler zu umgehen
  updateFilterFromEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.updateFilter(inputElement.value);
  }

  // add new name to show combine latest reacts to change of both input values
  addName(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    const newName = input.value.trim();
    if (newName) {
      // Holt die aktuelle Liste und fügt den neuen Namen hinzu
      const updatedNames = [...this.names$.value, newName];
      this.names$.next(updatedNames); // Aktualisiert das BehaviorSubject
      input.value = ''; // Setzt das Eingabefeld zurück
    }
  }

  // ------ Filter mit Pagination ------
  // Hinzufügen von Sortier- und Paginierungsoptionen
  sort$ = new BehaviorSubject<string>('asc');
  page$ = new BehaviorSubject<number>(0);
  pageSize$ = new BehaviorSubject<number>(5);

  // Kombiniere Filter, Sortierung und Paginierung
  filteredAndPagedNames$ = combineLatest([
    this.names$,
    this.filter$,
    this.sort$,
    this.page$,
    this.pageSize$
  ]).pipe(
    map(([names, filter, sort, page, pageSize]) => {
      const filtered = names.filter((name) => name.toLowerCase().includes(filter.toLowerCase()));
      const sorted = filtered.sort((a, b) =>
        sort === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      const start = page * pageSize;
      return sorted.slice(start, start + pageSize);
    })
  );

  // Methoden für Sortierung und Paginierung
  updateSort(direction: string) {
    this.sort$.next(direction);
  }

  updatePage(newPage: number) {
    this.page$.next(newPage);
  }
}
