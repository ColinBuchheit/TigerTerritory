// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CalendarDay {
  number: number;
  currentMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
  events?: Array<{
    title: string;
    type: string;
  }>;
}

interface Event {
  date: string;
  event: string;
  time: string;
  location: string;
  type: string; // e.g., 'football', 'basketball', etc.
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  // Calendar data
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  currentMonth: string = '';
  currentYear: number = 0;
  
  // Events data
  upcomingEvents: Event[] = [
    {
      date: '2025-04-25',
      event: 'Football Game',
      time: '2:00 PM',
      location: 'Faurot Field',
      type: 'football'
    },
    {
      date: '2025-04-26',
      event: 'Basketball Practice',
      time: '10:00 AM',
      location: 'Mizzou Arena',
      type: 'basketball'
    },
    {
      date: '2025-04-27',
      event: 'Wrestling Tournament',
      time: '9:00 AM',
      location: 'Hearnes Center',
      type: 'wrestling'
    },
    {
      date: '2025-05-02',
      event: 'Baseball vs. Alabama',
      time: '3:30 PM',
      location: 'Taylor Stadium',
      type: 'baseball'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    this.currentMonth = today.toLocaleString('default', { month: 'long' });
    this.currentYear = year;
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month
    const daysFromPrevMonth = firstDay.getDay();
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      this.calendarDays.push({
        number: prevDate.getDate(),
        currentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }
    
    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = this.formatDate(date);
      
      // Check if this day has events
      const todayEvents = this.upcomingEvents.filter(event => 
        event.date === dateString
      );
      
      this.calendarDays.push({
        number: i,
        currentMonth: true,
        isToday: this.isToday(date),
        hasEvent: todayEvents.length > 0,
        events: todayEvents.map(e => ({
          title: e.event,
          type: e.type
        }))
      });
    }
    
    // Days from next month
    const daysFromNextMonth = 42 - this.calendarDays.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= daysFromNextMonth; i++) {
      this.calendarDays.push({
        number: i,
        currentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getEventColor(type: string): string {
    switch(type) {
      case 'football': return '#E53935'; // red
      case 'basketball': return '#1E88E5'; // blue
      case 'baseball': return '#43A047'; // green
      case 'wrestling': return '#FB8C00'; // orange
      default: return '#F1B82D'; // mizzou gold
    }
  }
  
  getDay(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString();
  }
  
  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  }
}