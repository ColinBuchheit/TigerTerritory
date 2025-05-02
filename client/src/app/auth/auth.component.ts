import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  mode: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;

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
    this.initializeForm();
  }

  initializeForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.mode === 'register') {
      this.authForm.addControl('username', this.fb.control('', [Validators.required]));
    }
  }

  toggleMode(): void {
    this.errorMessage = null;
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.authForm.reset();
    this.initializeForm();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    
    // Find password input and toggle its type
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.authForm.controls).forEach(key => {
        this.authForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    const auth = {
      email: this.authForm.get('email')?.value,
      username: this.mode === 'register' ? this.authForm.get('username')?.value : '',
      password: this.authForm.get('password')?.value
    };
    
    this.authService.handleAuth(auth, this.mode === 'register')
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
}