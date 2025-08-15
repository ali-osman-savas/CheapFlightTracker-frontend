import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="login-container">
      <p-card header="Giriş Yap" class="login-card">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email" 
              pInputText 
              formControlName="email"
              placeholder="Email adresinizi girin"
              class="w-full"
              [class.ng-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <small 
              class="p-error" 
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
              Geçerli bir email adresi girin
            </small>
          </div>

          <div class="field">
            <label for="password">Şifre</label>
            <p-password 
              id="password"
              formControlName="password"
              placeholder="Şifrenizi girin"
              styleClass="w-full"
              inputStyleClass="w-full"
              [feedback]="false"
              [toggleMask]="true"
            />
            <small 
              class="p-error" 
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              Şifre gereklidir
            </small>
          </div>

          <p-message 
            *ngIf="errorMessage" 
            severity="error" 
            [text]="errorMessage"
            styleClass="w-full mb-3"
          />

          <p-button 
            type="submit"
            label="Giriş Yap"
            styleClass="w-full"
            [loading]="loading"
            [disabled]="loginForm.invalid"
          />

          <div class="text-center mt-3">
            <span>Hesabınız yok mu? </span>
            <a routerLink="/auth/register" class="text-primary-500">Kayıt Ol</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .field {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    :host ::ng-deep .p-card-body {
      padding: 2rem;
    }

    :host ::ng-deep .p-card-header {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Giriş yapılırken bir hata oluştu';
        }
      });
    }
  }
}