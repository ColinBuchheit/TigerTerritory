
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit{

  authForm!: FormGroup;
  mode: string = 'Log In';

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.authForm.controls['username'].disable;
  }

  onSubmit(): void {
    const auth: AuthModel = {
      email: this.authForm.get('email')?.value,
      username: this.authForm.controls['username']?.enabled ? this.authForm.get('username')?.value : null,
      password: this.authForm.get('username')?.value
    };
    this.authService.handleAuth(auth, this.mode == 'Create Account');
  }

  swap(): void {
    if (this.mode == 'Log In') { this.mode = 'Create Account';}
    else if (this.mode == 'Create Account') { this.mode = 'Log In';}
  }
 
}
