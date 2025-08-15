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
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <p-card header="Kayıt Ol" class="register-card">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="fullName">Ad Soyad</label>
            <input 
              id="fullName"
              type="text" 
              pInputText 
              formControlName="fullName"
              placeholder="Ad soyadınızı girin"
              class="w-full"
              [class.ng-invalid]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
            />
            <small 
              class="p-error" 
              *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
            >
              Ad soyad gereklidir
            </small>
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email" 
              pInputText 
              formControlName="email"
              placeholder="Email adresinizi girin"
              class="w-full"
              [class.ng-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <small 
              class="p-error" 
              *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
              Geçerli bir email adresi girin
            </small>
          </div>

          <div class="field">
            <label for="phone">Telefon (Opsiyonel)</label>
            <input 
              id="phone"
              type="tel" 
              pInputText 
              formControlName="phone"
              placeholder="Telefon numaranızı girin"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="password">Şifre</label>
            <p-password 
              id="password"
              formControlName="password"
              placeholder="Şifrenizi girin"
              styleClass="w-full"
              inputStyleClass="w-full"
              [feedback]="true"
              [toggleMask]="true"
            />
            <small 
              class="p-error" 
              *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
              Şifre en az 6 karakter olmalıdır
            </small>
          </div>

          <div class="field">
            <label for="confirmPassword">Şifre Tekrar</label>
            <p-password 
              id="confirmPassword"
              formControlName="confirmPassword"
              placeholder="Şifrenizi tekrar girin"
              styleClass="w-full"
              inputStyleClass="w-full"
              [feedback]="false"
              [toggleMask]="true"
            />
            <small 
              class="p-error" 
              *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            >
              Şifreler eşleşmiyor
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
            label="Kayıt Ol"
            styleClass="w-full"
            [loading]="loading"
            [disabled]="registerForm.invalid"
          />

          <div class="text-center mt-3">
            <span>Zaten hesabınız var mı? </span>
            <a routerLink="/auth/login" class="text-primary-500">Giriş Yap</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .register-card {
      width: 100%;
      max-width: 450px;
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
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const registerRequest: RegisterRequest = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Kayıt olurken bir hata oluştu';
        }
      });
    }
  }
}