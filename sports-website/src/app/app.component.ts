import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // Remove HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tiger Territory';
  isAuthenticated = false;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Subscribe to auth status changes
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    // Check initial auth status
    this.authService.checkAuthStatus();
  }
  
  onLogout() {
    this.authService.logout();
  }
}