import { Component } from '@angular/core';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';

@Component({
    selector: 'app-dashboard',
    imports: [DashboardCardComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
