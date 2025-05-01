import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule,
    NavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tiger Territory';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Check initial auth status
    this.authService.checkAuthStatus();
  }
}