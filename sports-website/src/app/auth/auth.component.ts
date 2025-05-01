import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Disable username field initially since we start in login mode
    this.authForm.controls['username'].disable();
  }

  onSubmit(): void {
    const auth: AuthModel = {
      email: this.authForm.get('email')?.value,
      username: this.authForm.controls['username'].enabled ? this.authForm.get('username')?.value : '',
      password: this.authForm.get('password')?.value
    };
    
    this.authService.handleAuth(auth, this.mode === 'Create Account')
      .subscribe({
        next: (response) => {
          console.log('Authentication successful', response);
          // Handle successful login/registration here (e.g., store token, redirect)
        },
        error: (error) => {
          console.error('Authentication failed', error);
          // Handle error (show error message to user)
        }
      });
  }

  swap(): void {
    if (this.mode === 'Log In') {
      this.mode = 'Create Account';
      this.authForm.controls['username'].enable();
    } else {
      this.mode = 'Log In';
      this.authForm.controls['username'].disable();
    }
  }
}