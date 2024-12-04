import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, interval, map, Observable, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor() {
    const bsub = new BehaviorSubject<number>(4);
    const a = of(bsub).pipe(map((x: any) => x * 2));

    a.subscribe((val) => console.log(val));

    bsub.next(4);
    bsub.next(10);

    // const switched = of(a, b, c, d).pipe(switchMap((x) => of(x, x ** 2, x ** 3, x ** 4)));
    // switched.subscribe((x) => console.log(x));

    // const mapped = of(3, 1).pipe(map((x) => ({ x: x ** 4, x2: x })));
    // mapped.subscribe((x) => console.log(x));

    // Ein Quell-Observable, das alle 500ms einen Wert emittiert
    const source$ = interval(500).pipe(take(5)); // Emittiert 0,1,2,3,4

    const result$ = source$.pipe(
      switchMap((value) => {
        console.log(`Start Verarbeitung von Wert ${value}`);
        return new Observable((observer) => {
          const timeoutId = setTimeout(() => {
            observer.next(`Verarbeiteter Wert ${value}`);
            observer.complete();
          }, 1000); // Verarbeitung dauert 1000ms

          return () => {
            clearTimeout(timeoutId);
            console.log(`Abgebrochene Verarbeitung von Wert ${value}`);
          };
        });
      })
    );

    result$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('Fertig')
    });
  }
}
