import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-dashboard-card',
    imports: [MatCardModule],
    templateUrl: './dashboard-card.component.html',
    styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {}
