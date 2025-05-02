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
    time: string;
    location: string;
    venue?: string;
    type: string; // e.g., 'baseball', 'basketball', etc.
  }>;
}

interface Event {
  date: string;
  title: string;
  time: string;
  location: string;
  venue?: string;
  type: string;
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
  
  // Events data for calendar
  sportsEvents: Event[] = [
    { 
      date: '2025-05-02', 
      title: 'Baseball vs Georgia', 
      time: '6 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-03', 
      title: 'Baseball vs Georgia', 
      time: '7 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-04', 
      title: 'Baseball vs Georgia', 
      time: '1 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM', 
      type: 'baseball' 
    },
    { 
      date: '2025-05-06', 
      title: 'Baseball vs Kansas', 
      time: '6 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-09', 
      title: 'Baseball at Texas A&M', 
      time: '6 p.m.', 
      location: 'College Station, Texas', 
      type: 'baseball' 
    },
    { 
      date: '2025-05-10', 
      title: 'Baseball at Texas A&M', 
      time: '2 p.m.', 
      location: 'College Station, Texas', 
      type: 'baseball' 
    },
    { 
      date: '2025-05-11', 
      title: 'Baseball at Texas A&M', 
      time: '1 p.m.', 
      location: 'College Station, Texas', 
      type: 'baseball' 
    },
    { 
      date: '2025-05-15', 
      title: 'Baseball vs Mississippi State', 
      time: '6 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-16', 
      title: 'Baseball vs Mississippi State', 
      time: '6 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-17', 
      title: 'Baseball vs Mississippi State', 
      time: '2 p.m.', 
      location: 'Columbia, Mo.', 
      venue: 'TAYLOR STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-20', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-21', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-22', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-23', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-24', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-25', 
      title: 'Baseball vs TBA (SEC Tournament)', 
      time: 'TBA', 
      location: 'Hoover, Ala.', 
      venue: 'HOOVER METROPOLITAN STADIUM',
      type: 'baseball' 
    },
    { 
      date: '2025-05-30', 
      title: 'Baseball vs TBA (NCAA Regional)', 
      time: 'TBA', 
      location: 'TBA', 
      type: 'baseball' 
    },
    { 
      date: '2025-05-31', 
      title: 'Baseball vs TBA (NCAA Regional)', 
      time: 'TBA', 
      location: 'TBA', 
      type: 'baseball' 
    }
  ];
  
  // Events for upcoming events section
  upcomingEvents: Event[] = [];

  constructor() {}

  ngOnInit(): void {
    this.generateCalendar(4, 2025); // May 2025 (0-indexed month)
    this.getUpcomingEvents();
  }

  generateCalendar(month: number, year: number): void {
    // Reset calendar days
    this.calendarDays = [];
    this.currentMonth = new Date(year, month).toLocaleString('default', { month: 'long' });
    this.currentYear = year;
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month
    const daysFromPrevMonth = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      const dateStr = this.formatDate(prevDate);
      
      // Get events for this day
      const dayEvents = this.sportsEvents.filter(event => event.date === dateStr);
      
      this.calendarDays.push({
        number: prevDate.getDate(),
        currentMonth: false,
        isToday: this.isToday(prevDate),
        hasEvent: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = this.formatDate(date);
      
      // Get events for this day
      const dayEvents = this.sportsEvents.filter(event => event.date === dateStr);
      
      this.calendarDays.push({
        number: i,
        currentMonth: true,
        isToday: this.isToday(date),
        hasEvent: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    // Days from next month
    const daysFromNextMonth = 42 - this.calendarDays.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = this.formatDate(nextDate);
      
      // Get events for this day
      const dayEvents = this.sportsEvents.filter(event => event.date === dateStr);
      
      this.calendarDays.push({
        number: i,
        currentMonth: false,
        isToday: this.isToday(nextDate),
        hasEvent: dayEvents.length > 0,
        events: dayEvents
      });
    }
  }
  
  isToday(date: Date): boolean {
    // For demo purposes, let's assume today is May 1, 2025 to match with the website date
    const today = new Date(2025, 4, 1); // May 1, 2025
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
  
  getUpcomingEvents(): void {
    // Create a date for May 1, 2025
    const currentDate = new Date(2025, 4, 1);
    // Filter to get upcoming events (next two weeks)
    const twoWeeksLater = new Date(currentDate);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    
    this.upcomingEvents = this.sportsEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate <= twoWeeksLater;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4); // Limit to 4 upcoming events
  }
}