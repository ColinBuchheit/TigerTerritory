// Improved navigation.component.ts
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('profileBtn') profileBtn!: ElementRef;
  @ViewChild('profileMenu') profileMenu!: ElementRef;

  isAuthenticated = false;
  user: any = null;
  showProfileMenu = false;
  isMobileMenuOpen = false;
  hasNotifications = false; // Set to true when you have notifications to show
  
  private authSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        
        // If authenticated, get user data
        if (isAuthenticated) {
          this.loadUserData();
        }
      }
    );
    
    // Initial check
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.userSubscription = this.authService.user$.subscribe(
      userData => {
        this.user = userData;
      }
    );
    
    this.authService.getCurrentUser().subscribe();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      this.isMobileMenuOpen = false; // Close mobile menu when opening profile menu
    }
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.showProfileMenu = false; // Close profile menu when opening mobile menu
    }
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    // Handle profile menu
    if (this.showProfileMenu && 
        this.profileBtn && 
        this.profileMenu && 
        !this.profileBtn.nativeElement.contains(event.target) && 
        !this.profileMenu.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
    }
    
    // Handle mobile menu close when clicking outside (optional)
    const target = event.target as HTMLElement;
    if (this.isMobileMenuOpen && 
        !target.closest('.mobile-menu-toggle') && 
        !target.closest('.main-nav')) {
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.showProfileMenu = false;
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}