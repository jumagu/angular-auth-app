import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthStatus } from '../../enums';

import { AuthService, FormsValidatorsService } from '../../services';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  private formsValidatorsService = inject(FormsValidatorsService);

  public myForm: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.formsValidatorsService.emailPattern),
      ],
    ],
    password: ['', [Validators.required]],
  });

  constructor() {
    localStorage.setItem('url', this.router.url);
  }

  public isValidField(field: string): boolean | null {
    return this.formsValidatorsService.isValidField(this.myForm, field);
  }

  public getErrorMessage(field: string): string | null {
    return this.formsValidatorsService.getErrorMessage(this.myForm, field);
  }

  public login(): void {
    if (this.myForm.valid) {
      this.authService.setAuthStatus(AuthStatus.checking);

      const { email, password } = this.myForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },

        error: (message) => {
          Swal.fire('Error', message, 'error');
          this.authService.setAuthStatus(AuthStatus.notAuthenticated);
        },
      });
    }
    this.myForm.markAllAsTouched();
  }
}
