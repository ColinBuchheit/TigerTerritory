import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  mode: string = 'Log In';
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already authenticated
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    
    // Initialize form
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Disable username field initially since we start in login mode
    this.authForm.get('username')?.disable();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const isRegistration = this.mode === 'Create Account';
    
    const auth: AuthModel = {
      email: this.authForm.get('email')?.value,
      username: isRegistration ? this.authForm.get('username')?.value : '',
      password: this.authForm.get('password')?.value
    };
    
    this.authService.handleAuth(auth, isRegistration)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Redirect to home page
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message || 'Authentication failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Authentication failed', error);
          this.errorMessage = error.error?.message || 'Authentication failed. Please try again.';
        }
      });
  }

  swap(): void {
    this.errorMessage = null;
    
    if (this.mode === 'Log In') {
      this.mode = 'Create Account';
      this.authForm.get('username')?.enable();
    } else {
      this.mode = 'Log In';
      this.authForm.get('username')?.disable();
      this.authForm.get('username')?.setValue('');
    }
  }
}