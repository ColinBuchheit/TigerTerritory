import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  // You can specify the calendar or any other data here
  calendarEvents = [
    { date: '2025-04-25', event: 'Football Game' },
    { date: '2025-04-26', event: 'Basketball Practice' },
    { date: '2025-04-27', event: 'Wrestling Tournament' },
  ];
}
